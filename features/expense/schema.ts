/**
 * Zod contracts for the AI Expense Report Generator.
 *
 * The extraction contract is the receipt contract EXTENDED (see
 * `features/receipt/schema.ts`) — there is deliberately no second receipt
 * schema in this codebase. An ExpenseRecord is a receipt plus payment method,
 * category, and notes.
 *
 * `expenseRowSchema` adds the client-assigned `id`, because a report holds
 * many records and the review screen needs a stable key. It is also the
 * server-side validation contract for the export endpoint.
 *
 * Pure module (only depends on zod) — testable with `node --test`.
 */

import { z } from 'zod'
import { nullableAmount, nullableString, parseJsonObject } from '../parsing.ts'
import { receiptItemSchema, receiptSchema } from '../receipt/schema.ts'
import { isExpenseCategory, DEFAULT_CATEGORY } from './categories.ts'

/** Max receipts the tool accepts per report (UI + server export guard). */
export const MAX_REPORT_ITEMS = 10

/** AI extraction contract: one receipt, no client id. */
export const expenseRecordSchema = receiptSchema.extend({
  // Every scalar is defaulted so a partially-read receipt still yields an
  // editable record instead of failing the whole extraction.
  merchantName: nullableString.default(null),
  transactionDate: nullableString.default(null),
  invoiceNumber: nullableString.default(null),
  currency: nullableString.default(null),
  paymentMethod: nullableString.default(null),
  category: nullableString.default(null),
  notes: nullableString.default(null),
  subtotal: nullableAmount.default(null),
  tax: nullableAmount.default(null),
  discount: nullableAmount.default(null),
  grandTotal: nullableAmount.default(null),
  items: z.array(receiptItemSchema).default([]),
})

export type ExpenseRecord = z.infer<typeof expenseRecordSchema>

/** A reviewed row: an expense record plus a stable client id. */
export const expenseRowSchema = expenseRecordSchema.extend({
  id: z.string().min(1).max(64),
  category: z.string().max(64).nullable().default(null),
})

export type ExpenseRow = z.infer<typeof expenseRowSchema>

/** The report document the client reviews and the exporters consume. */
export const expenseReportSchema = z.object({
  reportName: z.string().min(1).max(120),
  currency: nullableString.default(null),
  expenses: z.array(expenseRowSchema).max(MAX_REPORT_ITEMS),
})

export type ExpenseReport = z.infer<typeof expenseReportSchema>

/** Parse the model's raw text output into a validated ExpenseRecord. */
export function parseExpenseJson(text: string): ExpenseRecord {
  return parseJsonObject(text, expenseRecordSchema)
}

/** Merchant + item names, used as the category keyword fallback context. */
export function categoryContext(record: ExpenseRecord): string {
  return [record.merchantName ?? '', ...record.items.map((item) => item.name ?? '')]
    .filter(Boolean)
    .join(' ')
}

/** Build a review row from an AI record (ids are assigned by the caller). */
export function toExpenseRow(record: ExpenseRecord, id: string): ExpenseRow {
  return {
    ...record,
    id,
    category: isExpenseCategory(record.category) ? record.category : DEFAULT_CATEGORY,
  }
}
