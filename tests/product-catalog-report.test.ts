/**
 * Review-side contracts for the Product Catalog agent: merging several
 * extracted pages into one table, the deterministic statistics the review
 * screen and both exporters share, the advisory validation codes, and the
 * duplicate heuristic.
 *
 * Pure modules only — everything here runs under `node --test` with no Firebase,
 * no React, and no model call.
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { StandardFonts, PDFDocument } from 'pdf-lib'
import {
  MAX_CATALOG_PRODUCTS,
  MAX_PRODUCTS_PER_DOCUMENT,
  catalogReportSchema,
  parseProductCatalogJson,
  toCatalogRow,
  type CatalogReport,
  type CatalogRow,
  type ProductCatalog,
} from '../features/product-catalog/schema.ts'
import { catalogRowId, mergeCatalogs } from '../features/product-catalog/merge.ts'
import { buildCatalogSummary, catalogDocumentNames } from '../features/product-catalog/summary.ts'
import {
  countAdvisoryRows,
  countIncompleteRows,
  findCatalogIssues,
  isMarketplaceName,
  validateCatalogRows,
} from '../features/product-catalog/validation.ts'
import {
  duplicateRowIds,
  findPossibleDuplicates,
  normalizeProductName,
} from '../features/product-catalog/duplicates.ts'
import { textWidth, truncateToWidth } from '../lib/exporters/pdf-kit.ts'

let rowSeq = 0

function row(overrides: Partial<CatalogRow> = {}): CatalogRow {
  rowSeq += 1
  return {
    id: `r_${rowSeq}`,
    name: null,
    variant: null,
    sku: null,
    brand: null,
    category: null,
    price: null,
    originalPrice: null,
    discountPercent: null,
    store: null,
    rating: null,
    soldCount: null,
    sourceFile: null,
    sourcePage: null,
    notes: null,
    ...overrides,
  }
}

function report(products: CatalogRow[], overrides: Partial<CatalogReport> = {}): CatalogReport {
  return {
    catalogName: 'Katalog Lampu',
    source: 'Shopee',
    currency: 'IDR',
    shops: [],
    products,
    failedFiles: [],
    ...overrides,
  }
}

function catalog(products: unknown[], overrides: Partial<ProductCatalog> = {}): ProductCatalog {
  return parseProductCatalogJson(JSON.stringify({ products, ...overrides }))
}

test('pages merge in upload order and row ids stay derived from the coordinates', () => {
  const merged = mergeCatalogs({
    catalogName: 'Katalog Lampu',
    currency: 'IDR',
    catalogs: [
      catalog([{ name: 'Lampu A', price: 5000 }], { shops: ['TOKO A'] }),
      catalog([{ name: 'Lampu B', price: 7000 }], { shops: ['TOKO B', 'TOKO A'] }),
    ],
  })

  assert.deepEqual(
    merged.products.map((p) => p.id),
    [catalogRowId(0, 0), catalogRowId(1, 0)],
  )
  assert.deepEqual(
    merged.products.map((p) => p.name),
    ['Lampu A', 'Lampu B'],
  )
  // Shop headers are de-duplicated in first-seen order.
  assert.deepEqual(merged.shops, ['TOKO A', 'TOKO B'])
  assert.equal(merged.catalogName, 'Katalog Lampu')
  assert.equal(merged.currency, 'IDR')
})

test('shop names printed on the rows reach the list even when no header array is returned', () => {
  const merged = mergeCatalogs({
    catalogName: 'Katalog',
    catalogs: [
      catalog([
        { name: 'A', price: 1, store: 'BIO TALK' },
        { name: 'B', price: 2, store: 'bio talk' },
        { name: 'C', price: 3, store: 'Digitalisme Store' },
        { name: 'D', price: 4, store: null },
      ]),
    ],
  })
  // Case-insensitive de-duplication, empty stores skipped, header order first.
  assert.deepEqual(merged.shops, ['BIO TALK', 'Digitalisme Store'])
})

test('the user currency wins over whatever a page claims', () => {
  const merged = mergeCatalogs({
    catalogName: 'Katalog',
    currency: 'USD',
    catalogs: [catalog([{ name: 'A', price: 10 }], { currency: 'IDR' })],
  })
  assert.equal(merged.currency, 'USD')
})

test('a page that reports no currency leaves the chosen one untouched', () => {
  const merged = mergeCatalogs({
    catalogName: 'Katalog',
    currency: null,
    catalogs: [catalog([{ name: 'A', price: 10 }], { currency: 'IDR', source: 'Tokopedia' })],
  })
  assert.equal(merged.currency, 'IDR')
  assert.equal(merged.source, 'Tokopedia')
})

test('failed pages are listed instead of silently dropped', () => {
  const merged = mergeCatalogs({
    catalogName: 'Katalog',
    catalogs: [catalog([{ name: 'Lampu A', price: 5000 }])],
    failedFiles: ['Screenshot 2.png'],
  })
  assert.deepEqual(merged.failedFiles, ['Screenshot 2.png'])
  assert.equal(merged.products.length, 1)
})

test('the merged product count is bounded', () => {
  // Two full pages (400 each) merge to 800, which the report cap trims to 600.
  const page = (from: number, to: number) =>
    catalog(Array.from({ length: to - from }, (_, i) => ({ name: `P${from + i}`, price: 1 })))
  const merged = mergeCatalogs({
    catalogName: 'Katalog',
    catalogs: [page(0, MAX_PRODUCTS_PER_DOCUMENT), page(400, 800)],
  })
  assert.equal(merged.products.length, MAX_CATALOG_PRODUCTS)
})

test('toCatalogRow keeps the extracted values and only adds the id', () => {
  const extracted = parseProductCatalogJson(
    JSON.stringify({ products: [{ name: 'Lampu A', price: 'Rp 5.000', store: 'TOKO A' }] }),
  ).products[0]
  const built = toCatalogRow(extracted, 'r_1')
  assert.equal(built.id, 'r_1')
  assert.equal(built.price, 5000)
  assert.equal(built.store, 'TOKO A')
})

test('the export contract accepts a reviewed catalog and rejects junk', () => {
  const ok = catalogReportSchema.safeParse(
    report([row({ name: 'Lampu A', price: 5000 })]),
  )
  assert.equal(ok.success, true)

  assert.equal(catalogReportSchema.safeParse({ ...report([]), catalogName: '' }).success, false)
  assert.equal(catalogReportSchema.safeParse({ products: 'nope' }).success, false)
  // A row without an id cannot be reviewed, so it cannot be exported.
  const { id, ...withoutId } = row({ name: 'Lampu A' })
  assert.equal(catalogReportSchema.safeParse(report([withoutId as CatalogRow])).success, false)
})

test('the summary totals listed prices, not an invented business total', () => {
  const summary = buildCatalogSummary(
    report([
      row({ name: 'A', price: 5000, store: 'TOKO A' }),
      row({ name: 'B', price: 7000, store: 'TOKO A', discountPercent: 30 }),
      row({ name: 'C', price: null, store: 'TOKO B' }),
      row({ name: 'D', price: 9000 }),
    ]),
  )

  assert.equal(summary.productCount, 4)
  assert.equal(summary.pricedCount, 3)
  assert.equal(summary.discountedCount, 1)
  assert.equal(summary.totalValue, 21000)
  assert.equal(summary.minPrice, 5000)
  assert.equal(summary.maxPrice, 9000)
  assert.equal(summary.averagePrice, 7000)
})

test('the store breakdown splits counted and priced rows per shop', () => {
  const summary = buildCatalogSummary(
    report([
      row({ name: 'A', price: 10000, store: 'TOKO A' }),
      row({ name: 'B', price: 10000, store: 'TOKO A' }),
      row({ name: 'C', price: null, store: 'TOKO B' }),
    ]),
  )

  const tokoA = summary.stores.find((entry) => entry.name === 'TOKO A')
  assert.ok(tokoA)
  assert.equal(tokoA.productCount, 2)
  assert.equal(tokoA.pricedCount, 2)
  assert.equal(tokoA.totalValue, 20000)
  assert.equal(tokoA.percentage, 100)

  // Rows printed without a shop are grouped under a null key, not lost.
  assert.ok(summary.stores.some((entry) => entry.name === 'TOKO B' && entry.productCount === 1))
  assert.equal(summary.shopCount, 2, 'two distinct printed shops')
})

test('an empty catalog produces zeros rather than NaN', () => {
  const summary = buildCatalogSummary(report([]))
  assert.equal(summary.productCount, 0)
  assert.equal(summary.totalValue, 0)
  assert.equal(summary.averagePrice, null)
  assert.equal(summary.minPrice, null)
  assert.equal(summary.maxPrice, null)
  assert.deepEqual(summary.stores, [])
})

test('source documents are listed in first-seen order without duplicates', () => {
  const names = catalogDocumentNames([
    row({ sourceFile: 'a.png' }),
    row({ sourceFile: 'b.png' }),
    row({ sourceFile: 'a.png' }),
    row({ sourceFile: null }),
  ])
  assert.deepEqual(names, ['a.png', 'b.png'])
})

test('a row with neither name nor price is critical, the rest is advisory', () => {
  const missingBoth = row({ name: null, price: null })
  assert.deepEqual(findCatalogIssues(missingBoth), ['name', 'price'])

  assert.deepEqual(findCatalogIssues(row({ name: 'A', price: 100 })), [])

  // Live price above the struck-through one is a swap the user must confirm.
  assert.deepEqual(
    findCatalogIssues(row({ name: 'A', price: 100, originalPrice: 50 })),
    ['priceAboveOriginal'],
  )
  // A discount that matches the pair is fine.
  assert.deepEqual(
    findCatalogIssues(row({ name: 'A', price: 50, originalPrice: 100, discountPercent: 50 })),
    [],
  )
  assert.deepEqual(findCatalogIssues(row({ name: 'A', price: 10, rating: 7 })), ['ratingRange'])
  assert.deepEqual(findCatalogIssues(row({ name: 'A', price: 10, discountPercent: 140 })), [
    'discountRange',
  ])
})

test('critical and advisory rows are counted separately', () => {
  const issues = validateCatalogRows([
    row({ name: null, price: null }),
    row({ name: 'A', price: 100, originalPrice: 50 }),
    row({ name: 'B', price: 100 }),
  ])
  assert.equal(issues.length, 2)
  assert.equal(countIncompleteRows(issues), 1)
  assert.equal(countAdvisoryRows(issues), 1)
})

test('a marketplace name in the store column is flagged, a real shop is not', () => {
  for (const value of ['Tokopedia', 'tokopedia.com', 'Lazada Indonesia', 'SHOPEE.CO.ID', 'TikTok Shop', 'Bukalapak']) {
    assert.equal(isMarketplaceName(value), true, `${value} is a marketplace, not a shop`)
    assert.deepEqual(findCatalogIssues(row({ name: 'A', price: 10, store: value })), [
      'storeIsMarketplace',
    ])
  }
  // Real sellers must stay unflagged, including brand + badge style names.
  for (const value of ['Indomie Official Store', 'LUXARA Indonesia', 'NEKA LISTRIK', 'Tokopediaopedia']) {
    assert.equal(isMarketplaceName(value), false, `${value} is a seller, not a marketplace`)
    assert.deepEqual(findCatalogIssues(row({ name: 'A', price: 10, store: value })), [])
  }
  assert.equal(isMarketplaceName(null), false)
})

test('the same product name and price is flagged as a possible duplicate', () => {
  const groups = findPossibleDuplicates([
    row({ name: 'Lampu LED 5W', price: 5000, store: 'TOKO A' }),
    row({ name: 'Lampu LED 5W', price: 5000, store: 'TOKO B' }),
    row({ name: 'Lampu LED 10W', price: 5000 }),
  ])
  assert.equal(groups.length, 1)
  assert.deepEqual(duplicateRowIds(groups).size, 2)
})

test('a truncated marketplace title matches its full spelling', () => {
  assert.equal(
    normalizeProductName('LAMPU LED NEON FLEX SELANG 220V...'),
    normalizeProductName('Lampu LED Neon Flex Selang 220V'),
  )
})

test('different names, different prices, or unreadable rows are never duplicates', () => {
  // Same name, different price → not a duplicate.
  assert.deepEqual(
    findPossibleDuplicates([
      row({ name: 'Lampu LED 5W', price: 5000 }),
      row({ name: 'Lampu LED 5W', price: 7500 }),
    ]),
    [],
  )
  // Truncated titles that differ → not a duplicate.
  assert.deepEqual(
    findPossibleDuplicates([
      row({ name: 'Lampu LED 5W A', price: 5000 }),
      row({ name: 'Lampu LED 5W B', price: 5000 }),
    ]),
    [],
  )
  // A price difference within rounding tolerance still matches.
  assert.equal(
    findPossibleDuplicates([
      row({ name: 'Lampu LED 5W', price: 5000 }),
      row({ name: 'Lampu LED 5W', price: 5000.4 }),
    ]).length,
    1,
  )
  // Rows without a name or a price carry too little signal to accuse.
  assert.deepEqual(
    findPossibleDuplicates([
      row({ name: null, price: 5000 }),
      row({ name: null, price: 5000 }),
      row({ name: 'Lampu', price: null }),
    ]),
    [],
  )
  // A one-character title is too short to compare.
  assert.deepEqual(
    findPossibleDuplicates([row({ name: 'A', price: 10 }), row({ name: 'A', price: 10 })]),
    [],
  )
})

test('truncateToWidth fits the widest possible string into its column', async () => {
  // The catalog PDF prints marketplace titles in a fixed column. A character
  // budget overflows wide (CJK) glyphs, so the exporter must measure the real
  // font metrics of the exact string it draws.
  const doc = await PDFDocument.create()
  const helv = await doc.embedFont(StandardFonts.Helvetica)
  const columnWidth = 166

  const short = truncateToWidth('Lampu LED 5W', helv, 8.5, columnWidth)
  assert.equal(short, 'Lampu LED 5W', 'text that already fits is untouched')

  const longLatin = truncateToWidth('Lampu LED Panel 18W Putih 6500K Super Bright', helv, 8.5, columnWidth)
  assert.ok(longLatin.endsWith('...'))
  assert.ok(
    textWidth(longLatin, helv, 8.5) <= columnWidth,
    'a trimmed latin title must fit the column',
  )

  const wide = truncateToWidth(`\u65E5\u672C\u8A9E\u306E\u30C6\u30B9\u30C8\u756A${'\u540D\u524d'.repeat(20)}`, helv, 8.5, columnWidth)
  assert.ok(
    textWidth(wide, helv, 8.5) <= columnWidth,
    'a CJK title degraded to WinAnsi must still fit the column',
  )

  assert.equal(truncateToWidth(null, helv, 8.5, columnWidth), '-')
})
