/**
 * Zod schema + parsers for the structured receipt extraction contract.
 * Pure module (only depends on zod) — testable with `node --test`.
 */

import { z } from 'zod'
import { parseAmount, nullableAmount, nullableString, parseJsonObject } from '../parsing.ts'

export { parseAmount }

/**
 * Exported so sibling features (expense) extend the same item contract instead
 * of redefining it. Every field defaults to null: a partially-read line item
 * must never fail the whole extraction.
 */
export const receiptItemSchema = z.object({
  name: nullableString.default(null),
  quantity: nullableAmount.default(null),
  unitPrice: nullableAmount.default(null),
  total: nullableAmount.default(null),
})

export type ReceiptItem = z.infer<typeof receiptItemSchema>

export const receiptSchema = z.object({
  merchantName: nullableString,
  transactionDate: nullableString,
  invoiceNumber: nullableString,
  currency: nullableString,
  subtotal: nullableAmount,
  tax: nullableAmount,
  discount: nullableAmount,
  grandTotal: nullableAmount,
  items: z.array(receiptItemSchema).default([]),
  needsReview: z.boolean().optional().default(false),
  warnings: z.array(z.string()).default([]),
})

export type Receipt = z.infer<typeof receiptSchema>

/**
 * Parse the model's raw text output into a validated Receipt.
 * The model is instructed to return only JSON; we still extract the first
 * balanced object defensively and re-validate with zod.
 */
export function parseReceiptJson(text: string): Receipt {
  return parseJsonObject(text, receiptSchema)
}