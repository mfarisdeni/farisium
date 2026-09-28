/**
 * Pre-export validation for a reviewed catalog.
 *
 * Issues are machine-readable field codes (not sentences) so the UI can
 * localize them — the server must not dictate one language. Export is never
 * blocked: a catalogue row with an unreadable price is still worth exporting,
 * it just has to be visible to the user first.
 *
 * Pure module — no React, no server imports — testable with `node --test`.
 */

import type { CatalogRow } from './schema.ts'

export type CatalogIssueCode =
  | 'name'
  | 'price'
  | 'priceAboveOriginal'
  | 'ratingRange'
  | 'discountRange'
  | 'storeIsMarketplace'

export interface CatalogIssue {
  id: string
  issues: CatalogIssueCode[]
}

const RATING_MAX = 5
const DISCOUNT_MAX = 100

/**
 * Marketplaces are the *source* of a catalog page, never one of the shops on
 * it. Smaller models keep ignoring that rule and answering with "Tokopedia" or
 * "tokopedia.com" instead of the seller's name, which would silently collapse
 * every seller on the page into one bucket. Detecting it deterministically is
 * cheap and precise, so those rows get flagged for review.
 *
 * Kept deliberately narrow: a real shop can be called "Indomie Official Store",
 * so only a value that *is* the marketplace (optionally with a country suffix
 * or a domain) is flagged.
 */
const MARKETPLACE_PATTERN =
  /^(shopee|tokopedia|lazada|blibli|bukalapak|tiktok\s*shop(?:ee)?|akun\s*shopee)(?:[\s-]+[a-z]{2,12})?(?:\.(?:com|co\.id|id|shop))?$/

export function isMarketplaceName(value: string | null | undefined): boolean {
  const normalized = (value ?? '')
    .toLowerCase()
    .replace(/[^a-z\s.\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!normalized) return false
  return MARKETPLACE_PATTERN.test(normalized)
}

function num(value: number | null | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

/**
 * Critical issues are the ones that make a row useless for a product list —
 * it cannot be identified or priced. Everything else is advisory.
 */
export const CRITICAL_ISSUES: CatalogIssueCode[] = ['name', 'price']

export function findCatalogIssues(row: CatalogRow): CatalogIssueCode[] {
  const issues: CatalogIssueCode[] = []
  const price = num(row.price)
  const originalPrice = num(row.originalPrice)
  const rating = num(row.rating)
  const discount = num(row.discountPercent)

  if (!(row.name ?? '').trim()) issues.push('name')
  if (price === null) issues.push('price')

  // A live price above the struck-through one means the pair was swapped or
  // misread — the kind of mistake a human catches instantly in the table.
  if (price !== null && originalPrice !== null && price > originalPrice) {
    issues.push('priceAboveOriginal')
  }
  if (rating !== null && (rating < 0 || rating > RATING_MAX)) issues.push('ratingRange')
  if (discount !== null && (discount < 0 || discount > DISCOUNT_MAX)) issues.push('discountRange')
  if (isMarketplaceName(row.store)) issues.push('storeIsMarketplace')

  return issues
}

export function validateCatalogRows(rows: CatalogRow[]): CatalogIssue[] {
  const issues: CatalogIssue[] = []
  for (const row of rows) {
    const found = findCatalogIssues(row)
    if (found.length > 0) issues.push({ id: row.id, issues: found })
  }
  return issues
}

/** Rows missing at least one critical field (name or price). */
export function countIncompleteRows(issues: CatalogIssue[]): number {
  return issues.filter((issue) =>
    CRITICAL_ISSUES.some((code) => issue.issues.includes(code)),
  ).length
}

/** Rows with only advisory issues (still exportable, but worth a second look). */
export function countAdvisoryRows(issues: CatalogIssue[]): number {
  return issues.filter(
    (issue) => !CRITICAL_ISSUES.some((code) => issue.issues.includes(code)),
  ).length
}
