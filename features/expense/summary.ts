/**
 * Deterministic expense calculations shared by the review screen, the Excel
 * exporter, and the PDF exporter — one implementation, one set of rules.
 *
 * Calculation rule (per spec): a printed receipt total is the primary source.
 * Only when the receipt has no readable total do we fall back to
 * subtotal + tax - discount. Extracted values are never rewritten; anything
 * inconsistent is reported through `needsReview` / `warnings` instead.
 *
 * Pure module — no React, no server imports — testable with `node --test`.
 */

import {
  DEFAULT_CATEGORY,
  normalizeCategory,
  type ExpenseCategory,
} from './categories.ts'
import type { ExpenseReport, ExpenseRow } from './schema.ts'

function num(value: number | null | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

/**
 * The amount an expense contributes to the report: the printed grand total
 * when present, otherwise subtotal + tax - discount, otherwise 0.
 */
export function resolveExpenseTotal(row: ExpenseRow): number {
  const printed = num(row.grandTotal)
  if (printed !== null) return printed

  const subtotal = num(row.subtotal)
  const tax = num(row.tax) ?? 0
  const discount = num(row.discount) ?? 0
  if (subtotal !== null) return round2(subtotal + tax - discount)

  const itemsTotal = row.items.reduce((sum, item) => sum + (num(item.total) ?? 0), 0)
  return round2(itemsTotal + tax - discount)
}

/** True when the row has no readable total at all (needs a human). */
export function hasReadableTotal(row: ExpenseRow): boolean {
  return num(row.grandTotal) !== null || num(row.subtotal) !== null || row.items.length > 0
}

export function normalizeRowCategory(row: ExpenseRow): ExpenseCategory {
  const context = [row.merchantName ?? '', ...row.items.map((item) => item.name ?? '')].join(' ')
  return normalizeCategory(row.category, context)
}

export interface CategoryBreakdown {
  category: ExpenseCategory
  amount: number
  count: number
  /** Share of total expenses, 0–100, rounded to 1 decimal. */
  percentage: number
}

export interface ExpenseSummary {
  reportName: string
  currency: string | null
  receiptCount: number
  totalSubtotal: number
  totalTax: number
  totalDiscount: number
  totalExpenses: number
  needsReviewCount: number
  itemCount: number
  categories: CategoryBreakdown[]
}

export function buildExpenseSummary(report: ExpenseReport): ExpenseSummary {
  const buckets = new Map<ExpenseCategory, { amount: number; count: number }>()
  let totalSubtotal = 0
  let totalTax = 0
  let totalDiscount = 0
  let totalExpenses = 0
  let needsReviewCount = 0
  let itemCount = 0

  for (const row of report.expenses) {
    const total = resolveExpenseTotal(row)
    totalExpenses += total
    totalSubtotal += num(row.subtotal) ?? 0
    totalTax += num(row.tax) ?? 0
    totalDiscount += num(row.discount) ?? 0
    itemCount += row.items.length
    if (row.needsReview) needsReviewCount += 1

    const category = normalizeRowCategory(row)
    const bucket = buckets.get(category) ?? { amount: 0, count: 0 }
    bucket.amount += total
    bucket.count += 1
    buckets.set(category, bucket)
  }

  const categories: CategoryBreakdown[] = Array.from(buckets.entries())
    .map(([category, bucket]) => ({
      category,
      amount: round2(bucket.amount),
      count: bucket.count,
      percentage:
        totalExpenses > 0
          ? Math.round((bucket.amount / totalExpenses) * 1000) / 10
          : 0,
    }))
    .sort((a, b) => b.amount - a.amount || a.category.localeCompare(b.category))

  return {
    reportName: report.reportName,
    currency: report.currency,
    receiptCount: report.expenses.length,
    totalSubtotal: round2(totalSubtotal),
    totalTax: round2(totalTax),
    totalDiscount: round2(totalDiscount),
    totalExpenses: round2(totalExpenses),
    needsReviewCount,
    itemCount,
    categories,
  }
}

/** Currencies offered in the report settings; the AI still detects per receipt. */
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

export { DEFAULT_CATEGORY }
