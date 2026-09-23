import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateInvoiceTotals, applyInvoiceValidation } from '../features/invoice/validation.ts'
import type { Invoice } from '../features/invoice/schema.ts'

function makeInvoice(overrides: Partial<Invoice> = {}): Invoice {
  return {
    invoiceNumber: 'INV-2026-001',
    issueDate: '2026-09-20',
    dueDate: null,
    currency: 'IDR',
    seller: { name: 'CV Karya Jaya', address: null, contact: null, taxId: null },
    buyer: { name: 'PT Konsumen Bahagia', address: null, contact: null, taxId: null },
    items: [
      { name: 'A', description: null, quantity: 2, unitPrice: 50000, total: 100000 },
      { name: 'B', description: null, quantity: 1, unitPrice: 25000, total: 25000 },
    ],
    subtotal: 125000,
    tax: 12500,
    taxRate: null,
    shipping: 0,
    discount: 0,
    grandTotal: 137500,
    paymentMethod: null,
    notes: null,
    needsReview: false,
    warnings: [],
    ...overrides,
  }
}

test('consistent invoice passes without warnings', () => {
  const result = validateInvoiceTotals(makeInvoice())
  assert.equal(result.needsReview, false)
  assert.deepEqual(result.warnings, [])
})

test('mismatched item sum vs subtotal is flagged', () => {
  const result = validateInvoiceTotals(makeInvoice({ subtotal: 100000 }))
  assert.equal(result.needsReview, true)
  assert.ok(result.warnings.some((w) => w.includes('subtotal')))
})

test('inconsistent quantity × unitPrice vs total is flagged', () => {
  const result = validateInvoiceTotals(makeInvoice({ subtotal: 999999 }))
  assert.equal(result.needsReview, true)
  validateInvoiceTotals(
    makeInvoice({
      items: [{ name: 'A', description: null, quantity: 2, unitPrice: 50000, total: 200000 }],
    }),
  )
})

test('grand total mismatch with subtotal + tax + shipping - discount is flagged', () => {
  const result = validateInvoiceTotals(makeInvoice({ discount: 50000 }))
  assert.equal(result.needsReview, true)
  assert.ok(result.warnings.some((w) => w.includes('Total akhir')))
})

test('missing grand total is flagged', () => {
  const result = validateInvoiceTotals(makeInvoice({ grandTotal: null }))
  assert.equal(result.needsReview, true)
})

test('unreadable invoice is flagged as not readable', () => {
  const result = validateInvoiceTotals(makeInvoice({ grandTotal: null, subtotal: null, items: [] }))
  assert.ok(result.warnings.some((w) => w.includes('tidak terbaca')))
})

test('applyInvoiceValidation merges warnings without duplicating and never modifies AI values', () => {
  const invoice = makeInvoice({ grandTotal: null, warnings: ['bias'] })
  const result = validateInvoiceTotals(invoice)
  const merged = applyInvoiceValidation(invoice, result)
  assert.equal(merged.needsReview, true)
  assert.ok(merged.warnings.includes('bias'))
  const count = merged.warnings.filter((w) => w === 'bias').length
  assert.equal(count, 1)
  assert.equal(merged.grandTotal, null)
  assert.equal(merged.subtotal, 125000)
})