import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  MAX_REPORT_ITEMS,
  categoryContext,
  expenseReportSchema,
  expenseRowSchema,
  parseExpenseJson,
  toExpenseRow,
} from '../features/expense/schema.ts'
import { isExpenseCategory, normalizeCategory } from '../features/expense/categories.ts'

const VALID_EXPENSE_JSON = JSON.stringify({
  merchantName: 'TOKO SEJAHTERA',
  transactionDate: '2026-09-14',
  invoiceNumber: 'INV-0099',
  currency: 'IDR',
  paymentMethod: 'QRIS',
  category: 'food_dining',
  notes: 'K|team lunch',
  subtotal: 215500,
  tax: 23705,
  discount: 0,
  grandTotal: 239205,
  items: [
    { name: 'Telur 10 butir', quantity: 2, unitPrice: 32000, total: 64000 },
    { name: 'Minyak goreng 1L', quantity: 1, unitPrice: 18500, total: 18500 },
  ],
  needsReview: false,
  warnings: [],
})

test('parseExpenseJson reads a full expense record', () => {
  const record = parseExpenseJson(VALID_EXPENSE_JSON)

  assert.equal(record.merchantName, 'TOKO SEJAHTERA')
  assert.equal(record.transactionDate, '2026-09-14')
  assert.equal(record.currency, 'IDR')
  assert.equal(record.paymentMethod, 'QRIS')
  assert.equal(record.grandTotal, 239205)
  assert.equal(record.items.length, 2)
  assert.equal(record.items[0].total, 64000)
})

test('parseExpenseJson tolerates Indonesian and Western number formats', () => {
  const record = parseExpenseJson(
    JSON.stringify({ grandTotal: 'Rp 239.205,50', subtotal: '215.500,00' }),
  )
  assert.equal(record.grandTotal, 239205.5)
  assert.equal(record.subtotal, 215500)
})

test('a nearly empty receipt still parses into an editable record', () => {
  // The model must never fail the whole report just because a field is unread.
  const record = parseExpenseJson('{"merchantName": "WARUNG KOPI"}')

  assert.equal(record.merchantName, 'WARUNG KOPI')
  assert.equal(record.grandTotal, null)
  assert.equal(record.transactionDate, null)
  assert.equal(record.paymentMethod, null)
  assert.deepEqual(record.items, [])
})

test('expenseRowSchema requires an id and accepts a null category', () => {
  const row = expenseRowSchema.parse({ id: 'r_1', merchantName: 'KAFE', category: null })
  assert.equal(row.id, 'r_1')
  assert.equal(row.category, null)

  assert.equal(expenseRowSchema.safeParse({ merchantName: 'KAFE' }).success, false)
})

test('expenseReportSchema caps the report at MAX_REPORT_ITEMS', () => {
  const expenses = Array.from({ length: MAX_REPORT_ITEMS }, (_, i) => ({
    id: `r_${i}`,
    merchantName: 'TOKO',
  }))

  assert.equal(
    expenseReportSchema.safeParse({ reportName: 'September', expenses }).success,
    true,
  )
  assert.equal(
    expenseReportSchema.safeParse({
      reportName: 'September',
      expenses: [...expenses, { id: 'overflow', merchantName: 'TOKO' }],
    }).success,
    false,
  )
})

test('toExpenseRow assigns the id and falls back to the other category', () => {
  const row = toExpenseRow(
    { ...parseExpenseJson('{"merchantName":"TOKO"}'), category: 'makan siang' },
    'r_42',
  )
  assert.equal(row.id, 'r_42')
  assert.equal(row.category, 'other')
})

test('normalizeCategory maps aliases and falls back through keywords', () => {
  assert.equal(normalizeCategory('food_dining'), 'food_dining')
  assert.equal(normalizeCategory('Food & Dining'), 'food_dining')
  assert.equal(normalizeCategory('makan'), 'food_dining')
  assert.equal(normalizeCategory('hosting', 'Domain dan VPS'), 'software_subscription')
  assert.equal(normalizeCategory(null, 'Grab ke kantor'), 'transportation')
  // Unknown and no keyword evidence must never produce a guess.
  assert.equal(normalizeCategory('gibberish', 'xyz'), 'other')
  assert.equal(normalizeCategory(null), 'other')
})

test('isExpenseCategory only accepts canonical keys', () => {
  assert.equal(isExpenseCategory('marketing'), true)
  assert.equal(isExpenseCategory('Marketing'), false)
  assert.equal(isExpenseCategory('unknown_bucket'), false)
  assert.equal(isExpenseCategory(null), false)
})

test('categoryContext merges merchant and item names', () => {
  const record = parseExpenseJson(
    JSON.stringify({ merchantName: 'TOKO', items: [{ name: 'Kopi', total: 1 }, { name: null, total: 1 }] }),
  )
  assert.equal(categoryContext(record), 'TOKO Kopi')
})
