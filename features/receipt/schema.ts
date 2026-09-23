/**
 * Zod schema + parsers for the structured receipt extraction contract.
 * Pure module (only depends on zod) — testable with `node --test`.
 */

import { z } from 'zod'
import { ApiError } from '../../lib/api.ts'
import { parseAmount, nullableAmount, nullableString } from '../parsing.ts'

export { parseAmount }

const itemSchema = z.object({
  name: nullableString,
  quantity: nullableAmount,
  unitPrice: nullableAmount,
  total: nullableAmount,
})

export type ReceiptItem = z.infer<typeof itemSchema>

export const receiptSchema = z.object({
  merchantName: nullableString,
  transactionDate: nullableString,
  invoiceNumber: nullableString,
  currency: nullableString,
  subtotal: nullableAmount,
  tax: nullableAmount,
  discount: nullableAmount,
  grandTotal: nullableAmount,
  items: z.array(itemSchema).default([]),
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
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1) {
    throw new ApiError('Respons AI tidak valid. Coba lagi.', {
      status: 502,
      code: 'invalid_ai_response',
    })
  }

  let data: unknown
  try {
    data = JSON.parse(text.slice(start, end + 1))
  } catch {
    throw new ApiError('Respons AI tidak valid. Coba lagi.', {
      status: 502,
      code: 'invalid_ai_json',
    })
  }

  const parsed = receiptSchema.safeParse(data)
  if (!parsed.success) {
    throw new ApiError('Hasil ekstraksi AI tidak sesuai format. Coba lagi.', {
      status: 502,
      code: 'schema_validation_failed',
    })
  }

  return parsed.data
}