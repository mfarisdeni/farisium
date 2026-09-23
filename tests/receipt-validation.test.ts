import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateReceiptTotals, applyValidation } from '../features/receipt/validation.ts'

function makeReceipt(overrides: Record<string, unknown>) {
  return receipt(overrides)
}

import type { Receipt } from '../features/receipt/schema.ts'

function receipt(overrides: Partial<Receipt> & Record<string, unknown> = {}): Receipt {
  return {
    merchantName: 'Toko Berkah',
    transactionDate: '2026-09-20',
    currency: 'IDR',
    subtotal: 3000,
    tax: 0,
    discount: 0,
    grandTotal: 3000,
    items: [
      { name: 'Item A', quantity: 2, unitPrice: 1000, total: 2000 },
      { name: 'Item B', quantity: 1, unitPrice: 1000, total: 1000 },
    ],
    needsReview: false,
    warnings: [],
    ...overrides,
  }
}

test('consistent totals produce no review warnings', () => {
  const result = validateReceiptTotals(receipt())
  assert.equal(result.needsReview, false)
  assert.equal(result.warnings.length, 0)
})

test('grand total mismatch flags needsReview and adds a warning', () => {
  const result = validateReceiptTotals(receipt({ grandTotal: 9999 }))
  assert.equal(result.needsReview, true)
  assert.ok(result.warnings.some((w) => w.includes('Total akhir')))
})

test('items total vs subtotal mismatch is flagged', () => {
  const result = validateReceiptTotals(receipt({ subtotal: 3333 }))
  assert.equal(result.needsReview, true)
  assert.ok(result.warnings.some((w) => w.includes('Total item')))
})

test('per-item quantity × price mismatch is flagged without mutating values', () => {
  const base = receipt()
  const result = validateReceiptTotals({
    ...base,
    items: [{ name: 'Item A', quantity: 2, unitPrice: 1000, total: 5000 }],
  })
  assert.equal(result.needsReview, true)
  assert.ok(result.warnings.some((w) => w.includes('tidak konsisten')))
})

test('null subtotal + empty items flags the unreadable-receipt case', () => {
  const result = validateReceiptTotals(
    receipt({ subtotal: null, grandTotal: null, merchantName: null, items: [] }),
  )
  assert.equal(result.needsReview, true)
  assert.ok(result.warnings.some((w) => w.includes('Struk tidak terbaca')))
})

test('applyValidation merges warnings without duplicating or mutating AI values', () => {
  const base = receipt({ warnings: ['model warning'], grandTotal: 9999 })
  const result = validateReceiptTotals(base)
  const merged = applyValidation(base, result)

  assert.equal(merged.needsReview, true)
  assert.equal(merged.grandTotal, 9999)
  assert.equal(merged.warnings.length, 2)
  assert.ok(merged.warnings.includes('model warning'))
  assert.ok(merged.warnings.includes('Total akhir tidak cocok dengan subtotal + pajak - diskon.'))
})

test('grandTotal = subtotal + tax - discount passes when consistent', () => {
  const result = validateReceiptTotals(
    receipt({
      subtotal: 106,
      tax: 11,
      discount: 5,
      grandTotal: 112,
      items: [{ name: 'Item A', quantity: 1, unitPrice: 106, total: 106 }],
    }),
  )
  assert.equal(result.needsReview, false)
})

test('makeReceipt helper compiles (type sanity)', () => {
  const r = makeReceipt({ grandTotal: 1 })
  assert.equal(r.grandTotal, 1)
})