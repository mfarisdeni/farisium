/**
 * Deterministic arithmetic validation on top of the AI invoice extraction.
 * The AI's original values are NEVER modified here — disagreements are only
 * flagged via `needsReview` + `warnings` so the user decides.
 */

import type { Invoice } from './schema.ts'

const ROUNDING_TOLERANCE = 1.0

function isNumber(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function closeEnough(a: number | null | undefined, b: number | null | undefined): boolean {
  return isNumber(a) && isNumber(b) && Math.abs(a - b) <= ROUNDING_TOLERANCE
}

export interface ValidationResult {
  needsReview: boolean
  warnings: string[]
}

export function validateInvoiceTotals(invoice: Invoice): ValidationResult {
  const warnings: string[] = []
  let needsReview = invoice.needsReview ?? false

  const itemsTotal = invoice.items.reduce(
    (sum, item) => sum + (isNumber(item.total) ? (item.total as number) : 0),
    0,
  )

  // 1. sum(item.total) vs subtotal (only when subtotal is printed)
  if (isNumber(invoice.subtotal) && !closeEnough(itemsTotal, invoice.subtotal)) {
    needsReview = true
    warnings.push(
      'Total item tidak cocok dengan subtotal. Periksa kembali sebelum dipakai.',
    )
  }

  // 2. per-item sanity: quantity × unitPrice vs total
  invoice.items.forEach((item, index) => {
    if (
      isNumber(item.quantity) &&
      isNumber(item.unitPrice) &&
      isNumber(item.total) &&
      !closeEnough((item.quantity as number) * (item.unitPrice as number), item.total)
    ) {
      needsReview = true
      warnings.push(
        `Total item ${item.name ? `"${item.name}"` : `#${index + 1}`} tidak konsisten dengan harga dan kuantitas.`,
      )
    }
  })

  // 3. grandTotal vs (subtotal or items sum) + tax + shipping - discount
  const baseTotal = isNumber(invoice.subtotal)
    ? (invoice.subtotal as number)
    : isNumber(itemsTotal)
      ? itemsTotal
      : null
  const expectedGrand =
    (baseTotal ?? 0) + (invoice.tax ?? 0) + (invoice.shipping ?? 0) - (invoice.discount ?? 0)
  if (!isNumber(invoice.grandTotal)) {
    needsReview = true
    warnings.push('Total akhir tidak terbaca dari invoice.')
  } else if (baseTotal !== null && !closeEnough(expectedGrand, invoice.grandTotal)) {
    needsReview = true
    warnings.push('Total akhir tidak cocok dengan subtotal + pajak + ongkir - diskon.')
  }

  // 4. if everything is null, nothing meaningful was read
  if (
    !isNumber(invoice.grandTotal) &&
    !isNumber(invoice.subtotal) &&
    invoice.items.length === 0 &&
    !invoice.seller.name &&
    !invoice.buyer.name
  ) {
    needsReview = true
    warnings.push('Invoice tidak terbaca dengan jelas. Data mungkin tidak lengkap.')
  }

  return { needsReview, warnings }
}

/** Merge deterministic warnings into the invoice (without touching AI values). */
export function applyInvoiceValidation(invoice: Invoice, result: ValidationResult): Invoice {
  return {
    ...invoice,
    needsReview: result.needsReview || (invoice.needsReview ?? false),
    warnings: Array.from(new Set([...(invoice.warnings ?? []), ...result.warnings])),
  }
}