/**
 * Pre-export validation for a reviewed report.
 *
 * Reports issues as machine-readable field codes (not sentences) so the UI can
 * localize them — the server must not dictate one language. Export is never
 * blocked; critical gaps only surface as warnings.
 */

import { hasReadableTotal, resolveExpenseTotal } from './summary.ts'
import type { ExpenseRow } from './schema.ts'

export type MissingField = 'date' | 'merchant' | 'total' | 'category' | 'currency'

export interface ExpenseIssue {
  id: string
  missing: MissingField[]
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/** Fields that must be present for an expense to be considered complete. */
const CRITICAL_FIELDS: MissingField[] = ['date', 'merchant', 'total']

export function findIssues(row: ExpenseRow): MissingField[] {
  const missing: MissingField[] = []

  const date = (row.transactionDate ?? '').trim()
  if (!date) missing.push('date')
  else if (ISO_DATE.test(date) && Number.isNaN(Date.parse(date))) missing.push('date')

  if (!(row.merchantName ?? '').trim()) missing.push('merchant')
  if (!hasReadableTotal(row) || resolveExpenseTotal(row) <= 0) missing.push('total')

  // Advisory only — never blocks export.
  if (!(row.category ?? '').trim()) missing.push('category')

  return missing
}

export function validateExpenseRows(rows: ExpenseRow[]): ExpenseIssue[] {
  const issues: ExpenseIssue[] = []
  for (const row of rows) {
    const missing = findIssues(row)
    if (missing.length > 0) issues.push({ id: row.id, missing })
  }
  return issues
}

/** Rows that are missing at least one critical field (date/merchant/total). */
export function countIncompleteRows(issues: ExpenseIssue[]): number {
  return issues.filter((issue) =>
    CRITICAL_FIELDS.some((field) => issue.missing.includes(field)),
  ).length
}
