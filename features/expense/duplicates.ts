/**
 * Lightweight duplicate detection for a reviewed report.
 *
 * Purely advisory: a possible duplicate is flagged, never removed. Two rows
 * match when the normalized merchant, the date, and the total line up
 * (amounts compare with a small rounding tolerance, and a missing date on
 * either side is allowed so half-read receipts still surface).
 */

import { resolveExpenseTotal } from './summary.ts'
import type { ExpenseRow } from './schema.ts'

const RELATIVE_TOLERANCE = 0.005
const ABSOLUTE_TOLERANCE = 1

export interface DuplicateGroup {
  key: string
  ids: string[]
  merchant: string
  date: string | null
  total: number
}

function normalizeMerchant(value: string | null | undefined): string {
  if (!value) return ''
  return value
    .toLowerCase()
    .replace(/pt\.?\s*$/i, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function normalizeDate(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase()
}

function totalsMatch(a: number, b: number): boolean {
  const diff = Math.abs(a - b)
  if (diff <= ABSOLUTE_TOLERANCE) return true
  const largest = Math.max(Math.abs(a), Math.abs(b), 1)
  return diff / largest <= RELATIVE_TOLERANCE
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

/**
 * Group rows that look like the same receipt. Rows without a merchant or with
 * no readable total are never grouped (too little signal to accuse anyone).
 *
 * Grouping is merchant-first, then tolerant: two receipts only match when the
 * merchant is the same AND the dates are compatible (equal, or one side not
 * readable) AND the totals match within tolerance. Clustering this way matters
 * because two copies of the same receipt often differ by a rounding step or a
 * half-read date — an exact-key lookup would never see them as a pair.
 */
export function findPossibleDuplicates(rows: ExpenseRow[]): DuplicateGroup[] {
  const eligible = rows.filter((row) => {
    if (!normalizeMerchant(row.merchantName)) return false
    return resolveExpenseTotal(row) > 0
  })

  // One pass per merchant, so cross-merchant rows are never compared.
  const byMerchant = new Map<string, ExpenseRow[]>()
  for (const row of eligible) {
    const merchant = normalizeMerchant(row.merchantName)
    const group = byMerchant.get(merchant)
    if (group) group.push(row)
    else byMerchant.set(merchant, [row])
  }

  const groups: DuplicateGroup[] = []

  for (const merchantRows of byMerchant.values()) {
    const consumed = new Set<string>()

    for (const seed of merchantRows) {
      if (consumed.has(seed.id)) continue

      const seedDate = normalizeDate(seed.transactionDate)
      const seedTotal = resolveExpenseTotal(seed)
      const cluster = [seed]

      for (const candidate of merchantRows) {
        if (candidate.id === seed.id || consumed.has(candidate.id)) continue

        const candidateDate = normalizeDate(candidate.transactionDate)
        // A missing date on either side is allowed, otherwise both must match.
        if (candidateDate !== seedDate && candidateDate !== '' && seedDate !== '') continue
        if (!totalsMatch(resolveExpenseTotal(candidate), seedTotal)) continue

        cluster.push(candidate)
      }

      if (cluster.length < 2) continue

      for (const row of cluster) consumed.add(row.id)
      groups.push({
        key: `${normalizeMerchant(seed.merchantName)}|${seedDate}|${round2(seedTotal)}`,
        ids: cluster.map((row) => row.id),
        merchant: seed.merchantName ?? '',
        date: seed.transactionDate,
        total: round2(seedTotal),
      })
    }
  }

  return groups
}

/** Flatten duplicate groups into the set of flagged row ids. */
export function duplicateRowIds(groups: DuplicateGroup[]): Set<string> {
  const ids = new Set<string>()
  for (const group of groups) {
    for (const id of group.ids) ids.add(id)
  }
  return ids
}
