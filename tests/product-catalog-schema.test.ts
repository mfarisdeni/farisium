import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  MAX_PRODUCTS_PER_DOCUMENT,
  parseProductCatalogJson,
  productCatalogSchema,
} from '../features/product-catalog/schema.ts'
import { isStubCatalog } from '../features/product-catalog/extract.ts'
import { getModelChain, isTransientProviderError } from '../lib/ai/gemini.ts'

const parse = (json: unknown) => parseProductCatalogJson(JSON.stringify(json))

test('a single marketplace card becomes one product row', () => {
  const catalog = parse({
    source: 'Shopee',
    currency: 'IDR',
    products: [
      {
        name: 'LAMPU LED NEON FLEX SELANG 220V...',
        variant: '220V',
        price: 5800,
        originalPrice: null,
        discountPercent: 42,
        store: 'ANEKA LISTRIK',
        rating: 4.9,
        soldCount: '10RB+ terjual',
      },
    ],
  })

  assert.equal(catalog.products.length, 1)
  const product = catalog.products[0]
  assert.equal(product.name, 'LAMPU LED NEON FLEX SELANG 220V...')
  assert.equal(product.price, 5800)
  assert.equal(product.discountPercent, 42)
  assert.equal(product.store, 'ANEKA LISTRIK')
  assert.equal(product.rating, 4.9)
  // soldCount stays text, never coerced to a number
  assert.equal(product.soldCount, '10RB+ terjual')
})

test('indonesian price strings parse into plain numbers', () => {
  const catalog = parse({
    products: [
      { name: 'A', price: 'Rp 81.000' },
      { name: 'B', price: 'Rp 32.256' },
      { name: 'C', price: '12256' },
      { name: 'D', price: 'Rp 2.166' },
    ],
  })
  assert.deepEqual(
    catalog.products.map((p) => p.price),
    [81000, 32256, 12256, 2166],
  )
})

test('a decimal-comma rating is a number, not a thousands separator', () => {
  const catalog = parse({ products: [{ name: 'A', rating: '4,9' }] })
  assert.equal(catalog.products[0].rating, 4.9)
})

test('missing fields become null rather than guessed values', () => {
  const catalog = parse({ products: [{ name: 'Buku atomic habits', price: 19000 }] })
  const product = catalog.products[0]
  assert.equal(product.sku, null)
  assert.equal(product.category, null)
  assert.equal(product.brand, null)
  assert.equal(product.originalPrice, null)
  assert.equal(product.store, null)
  assert.equal(product.soldCount, null)
})

test('unreadable and empty text values are normalised to null', () => {
  const catalog = parse({
    products: [{ name: '  ', variant: 'N/A', sku: 'none', brand: undefined }],
  })
  const product = catalog.products[0]
  assert.equal(product.name, null)
  assert.equal(product.variant, null)
  assert.equal(product.sku, null)
  assert.equal(product.brand, null)
})

test('an empty or productless payload is a valid parse but a stub result', () => {
  const empty = parse({ products: [] })
  assert.equal(empty.products.length, 0)
  assert.equal(isStubCatalog(empty), true)

  const noProductsKey = parse({ source: 'Shopee', warnings: [] })
  assert.equal(isStubCatalog(noProductsKey), true)

  // Present but unusable rows still count as a stub.
  const blank = parse({ products: [{ name: null, price: null }] })
  assert.equal(isStubCatalog(blank), true)
})

test('a card with only a name or only a price is not a stub', () => {
  const named = parse({ products: [{ name: 'Buku atomic habits', price: null }] })
  assert.equal(isStubCatalog(named), false)

  const priced = parse({ products: [{ name: null, price: 19000 }] })
  assert.equal(isStubCatalog(priced), false)
})

test('the products array is bounded', () => {
  const many = {
    products: Array.from({ length: MAX_PRODUCTS_PER_DOCUMENT + 5 }, (_, i) => ({
      name: `P${i}`,
      price: i,
    })),
  }
  const result = productCatalogSchema.safeParse(many)
  assert.equal(result.success, false)
})

test('malformed model output is rejected rather than silently accepted', () => {
  assert.throws(() => parseProductCatalogJson('not json at all'))
  assert.throws(() => parseProductCatalogJson('[1, 2, 3]'))
})

test('transient provider failures are classified as retryable', () => {
  // Overload and capacity problems must allow falling back to another model.
  assert.equal(
    isTransientProviderError(new Error('{"code":503,"message":"high demand"}')),
    true,
  )
  assert.equal(
    isTransientProviderError(new Error('RESOURCE_EXHAUSTED: quota')),
    true,
  )
  assert.equal(isTransientProviderError(new Error('Deadline exceeded')), true)
  assert.equal(isTransientProviderError(new Error('fetch failed')), true)
})

test('configuration failures are not retryable, so misconfig still fails loudly', () => {
  assert.equal(
    isTransientProviderError(new Error('{"code":404,"message":"model not found"}')),
    false,
  )
  assert.equal(
    isTransientProviderError(new Error('{"code":400,"message":"API key not valid"}')),
    false,
  )
  assert.equal(
    isTransientProviderError(new Error('{"code":401,"message":"UNAUTHENTICATED"}')),
    false,
  )
})

/**
 * The free tier enforces its daily quota per model, so an exhausted quota is a
 * reason to try the *next* model, not to fail the request. These assertions
 * lock that behaviour down, because getting the order wrong means the agent
 * either dies on a 429 or quietly burns four requests on one dead model.
 */
test('the catalog chain starts with the feature model, then the shared default, then alternates', () => {
  const saved = {
    catalog: process.env.GEMINI_MODEL_CATALOG,
    shared: process.env.GEMINI_MODEL,
    fallbacks: process.env.GEMINI_FALLBACK_MODELS,
  }
  try {
    process.env.GEMINI_MODEL_CATALOG = 'gemini-3-flash-preview'
    process.env.GEMINI_MODEL = 'gemini-3.5-flash-lite'
    delete process.env.GEMINI_FALLBACK_MODELS

    const chain = getModelChain('catalog')
    assert.equal(chain[0], 'gemini-3-flash-preview', 'the strongest model is tried first')
    assert.equal(chain[1], 'gemini-3.5-flash-lite', 'the shared default is the first fallback')
    assert.ok(chain.length >= 3, 'the chain must have alternatives beyond the shared default')
    assert.ok(
      chain.includes('gemini-flash-latest') && chain.includes('gemini-3.6-flash'),
      'models outside the free-tier quota of the primary must be reachable',
    )
    assert.equal(new Set(chain).size, chain.length, 'no model is tried twice')
  } finally {
    if (saved.catalog === undefined) delete process.env.GEMINI_MODEL_CATALOG
    else process.env.GEMINI_MODEL_CATALOG = saved.catalog
    if (saved.shared === undefined) delete process.env.GEMINI_MODEL
    else process.env.GEMINI_MODEL = saved.shared
    if (saved.fallbacks === undefined) delete process.env.GEMINI_FALLBACK_MODELS
    else process.env.GEMINI_FALLBACK_MODELS = saved.fallbacks
  }
})

test('GEMINI_FALLBACK_MODELS is tried after the shared default and de-duplicated', () => {
  const savedCatalog = process.env.GEMINI_MODEL_CATALOG
  const savedShared = process.env.GEMINI_MODEL
  const savedFallbacks = process.env.GEMINI_FALLBACK_MODELS
  try {
    process.env.GEMINI_MODEL_CATALOG = 'model-a'
    process.env.GEMINI_MODEL = 'model-shared'
    process.env.GEMINI_FALLBACK_MODELS = ' model-b , model-a ,, model-c '

    const chain = getModelChain('catalog')
    assert.equal(chain[0], 'model-a', 'the feature model leads')
    assert.equal(chain[1], 'model-shared', 'the shared default is always the first fallback')
    assert.deepEqual(chain.slice(2, 5), ['model-b', 'model-c', 'gemini-3.5-flash-lite'])
    assert.equal(chain.filter((m) => m === 'model-a').length, 1, 'a repeat is dropped')
  } finally {
    if (savedCatalog === undefined) delete process.env.GEMINI_MODEL_CATALOG
    else process.env.GEMINI_MODEL_CATALOG = savedCatalog
    if (savedShared === undefined) delete process.env.GEMINI_MODEL
    else process.env.GEMINI_MODEL = savedShared
    if (savedFallbacks === undefined) delete process.env.GEMINI_FALLBACK_MODELS
    else process.env.GEMINI_FALLBACK_MODELS = savedFallbacks
  }
})
