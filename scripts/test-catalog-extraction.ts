/**
 * Local harness: run the product catalog extraction over real catalog files and
 * print the result, so extraction quality can be judged against the source.
 * Not part of the app. Run with:
 *   node --experimental-strip-types scripts/test-catalog-extraction.ts <file...>
 */

import { readFileSync } from 'node:fs'
import { basename, extname } from 'node:path'
import { extractProductCatalog } from '../features/product-catalog/extract.ts'
import type { ProductCatalog } from '../features/product-catalog/schema.ts'

const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
}

function summarise(catalog: ProductCatalog): void {
  console.log(`source   : ${catalog.source ?? '(null)'}`)
  console.log(`currency : ${catalog.currency ?? '(null)'}`)
  console.log(`products : ${catalog.products.length}`)
  console.log(`shops    : ${catalog.shops.length ? catalog.shops.join(' | ') : '(none)'}`)
  console.log(`needsReview: ${catalog.needsReview}`)
  console.log('')
  console.log(
    ['#', 'name', 'variant', 'price', 'original', 'disc%', 'store', 'rating', 'sold'].join(' | '),
  )
  catalog.products.forEach((p, i) => {
    console.log(
      [
        i + 1,
        p.name ?? '-',
        p.variant ?? '-',
        p.price ?? '-',
        p.originalPrice ?? '-',
        p.discountPercent ?? '-',
        p.store ?? '-',
        p.rating ?? '-',
        p.soldCount ?? '-',
      ].join(' | '),
    )
  })
  const missingName = catalog.products.filter((p) => !p.name).length
  const missingBoth = catalog.products.filter((p) => !p.name && p.price == null).length
  const badRating = catalog.products.filter((p) => p.rating != null && p.rating > 5).length
  console.log('')
  console.log(
    `quality: missing name=${missingName}, missing name+price=${missingBoth}, rating>5=${badRating}`,
  )
  if (catalog.warnings.length) {
    console.log('warnings:')
    for (const w of catalog.warnings) console.log(`  - ${w}`)
  }
}

async function main(): Promise<void> {
  const files = process.argv.slice(2)
  if (files.length === 0) {
    console.error('usage: node scripts/test-catalog-extraction.ts <file...>')
    process.exit(1)
  }

  for (const file of files) {
    const mimeType = MIME[extname(file).toLowerCase()]
    if (!mimeType) {
      console.error(`skip ${basename(file)}: unsupported extension`)
      continue
    }
    const base64 = readFileSync(file).toString('base64')
    console.log('='.repeat(78))
    console.log(`${basename(file)}  (${mimeType}, ${Math.round(base64.length * 0.75 / 1024)} KB)`)
    console.log('='.repeat(78))

    const started = Date.now()
    try {
      const catalog = await extractProductCatalog({
        base64,
        mimeType,
        fileName: basename(file),
        language: 'id',
      })
      console.log(`ok in ${((Date.now() - started) / 1000).toFixed(1)}s`)
      summarise(catalog)
    } catch (error) {
      console.log(`FAILED after ${((Date.now() - started) / 1000).toFixed(1)}s`)
      console.log(error instanceof Error ? `${error.name}: ${error.message}` : String(error))
    }
    console.log('')
  }
}

void main()
