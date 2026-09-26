/**
 * Zod schema + parsers for the structured invoice extraction contract.
 * Pure module (only depends on zod) — testable with `node --test`.
 */

import { z } from 'zod'
import { nullableAmount, nullableString, parseJsonObject } from '../parsing.ts'

const infoSchema = z.object({
  name: nullableString.default(null),
  address: nullableString.default(null),
  contact: nullableString.default(null),
  taxId: nullableString.default(null),
})

const invoiceItemSchema = z.object({
  name: nullableString.default(null),
  description: nullableString.default(null),
  quantity: nullableAmount.default(null),
  unitPrice: nullableAmount.default(null),
  total: nullableAmount.default(null),
})

export type InvoiceItem = z.infer<typeof invoiceItemSchema>
export type InvoiceParty = z.infer<typeof infoSchema>

export const invoiceSchema = z.object({
  invoiceNumber: nullableString.default(null),
  issueDate: nullableString.default(null),
  dueDate: nullableString.default(null),
  currency: nullableString.default(null),
  seller: z.preprocess((v) => (v == null ? {} : v), infoSchema),
  buyer: z.preprocess((v) => (v == null ? {} : v), infoSchema),
  items: z.array(invoiceItemSchema).default([]),
  subtotal: nullableAmount.default(null),
  tax: nullableAmount.default(null),
  taxRate: nullableAmount.default(null),
  discount: nullableAmount.default(null),
  shipping: nullableAmount.default(null),
  grandTotal: nullableAmount.default(null),
  paymentMethod: nullableString.default(null),
  notes: nullableString.default(null),
  needsReview: z.boolean().optional().default(false),
  warnings: z.array(z.string()).default([]),
})

export type Invoice = z.infer<typeof invoiceSchema>

/**
 * Parse the model's raw text output into a validated Invoice.
 * Extracts the first balanced object defensively and re-validates with zod.
 */
export function parseInvoiceJson(text: string): Invoice {
  return parseJsonObject(text, invoiceSchema)
}