/**
 * Deterministic catalog statistics shared by the review screen, the Excel
 * exporter, and the PDF exporter — one implementation, one set of rules.
 *
 * Nothing here rewrites an extracted value. Every number is derived from the
 * rows exactly as printed, so a cell in Excel always matches what the user saw
 * on the review screen. A "total value" is the sum of the live `price` values
 * and is explicitly NOT a business total: a catalogue page has no invoice
 * total, so the figure is labelled as a sum of listed prices.
 *
 * Pure module — no React, no server imports — testable with `node --test`.
 */

import type { CatalogReport, CatalogRow } from './schema.ts'

function num(value: number | null | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export interface StoreBreakdown {
  /** `null` for products printed without a shop above them. */
  name: string | null
  productCount: number
  pricedCount: number
  /** Sum of the listed prices of that store's products. */
  totalValue: number
  /** Share of the catalogue total value, 0–100, rounded to 1 decimal. */
  percentage: number
}

export interface CatalogSummary {
  catalogName: string
  currency: string | null
  productCount: number
  /** Rows with a readable name. */
  namedCount: number
  /** Rows with a readable live price. */
  pricedCount: number
  /** Rows with a struck-through original price or a discount percentage. */
  discountedCount: number
  /** Sum of the listed prices (NOT an invoice total). */
  totalValue: number
  minPrice: number | null
  maxPrice: number | null
  averagePrice: number | null
  shopCount: number
  stores: StoreBreakdown[]
}

export function buildCatalogSummary(report: CatalogReport): CatalogSummary {
  const buckets = new Map<string, { name: string | null; count: number; priced: number; value: number }>()
  let totalValue = 0
  let pricedCount = 0
  let namedCount = 0
  let discountedCount = 0
  let minPrice: number | null = null
  let maxPrice: number | null = null

  for (const row of report.products) {
    const price = num(row.price)
    const store = row.store?.trim() || null

    if (row.name) namedCount += 1
    if (price !== null) {
      pricedCount += 1
      totalValue += price
      minPrice = minPrice === null ? price : Math.min(minPrice, price)
      maxPrice = maxPrice === null ? price : Math.max(maxPrice, price)
    }
    if (num(row.originalPrice) !== null || num(row.discountPercent) !== null) {
      discountedCount += 1
    }

    const key = store ? store.toLowerCase() : ''
    const bucket = buckets.get(key) ?? { name: store, count: 0, priced: 0, value: 0 }
    bucket.count += 1
    if (price !== null) {
      bucket.priced += 1
      bucket.value += price
    }
    buckets.set(key, bucket)
  }

  const stores: StoreBreakdown[] = Array.from(buckets.values())
    .map((bucket) => ({
      name: bucket.name,
      productCount: bucket.count,
      pricedCount: bucket.priced,
      totalValue: round2(bucket.value),
      percentage:
        totalValue > 0 ? Math.round((bucket.value / totalValue) * 1000) / 10 : 0,
    }))
    .sort(
      (a, b) =>
        b.productCount - a.productCount ||
        (a.name ?? '').localeCompare(b.name ?? ''),
    )

  return {
    catalogName: report.catalogName,
    currency: report.currency,
    productCount: report.products.length,
    namedCount,
    pricedCount,
    discountedCount,
    totalValue: round2(totalValue),
    minPrice,
    maxPrice,
    averagePrice: pricedCount > 0 ? round2(totalValue / pricedCount) : null,
    shopCount: report.shops.length || stores.filter((s) => s.name !== null).length,
    stores,
  }
}

/** Distinct source documents behind the rows, in first-seen order. */
export function catalogDocumentNames(products: CatalogRow[]): string[] {
  const names: string[] = []
  for (const product of products) {
    const name = product.sourceFile?.trim()
    if (!name || names.includes(name)) continue
    names.push(name)
  }
  return names
}

/** Currencies offered in the catalog settings; the AI still detects per page. */
export const CURRENCY_OPTIONS = [
  'IDR',
  'USD',
  'MYR',
  'SGD',
  'THB',
  'VND',
  'PHP',
  'EUR',
  'GBP',
  'AUD',
  'JPY',
] as const

export function isCurrencyOption(value: unknown): value is (typeof CURRENCY_OPTIONS)[number] {
  return typeof value === 'string' && (CURRENCY_OPTIONS as readonly string[]).includes(value)
}
