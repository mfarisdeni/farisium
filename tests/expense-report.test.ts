import { test } from 'node:test'
import assert from 'node:assert/strict'
import { expenseReportSchema, type ExpenseRow } from '../features/expense/schema.ts'
import {
  buildExpenseSummary,
  hasReadableTotal,
  isCurrencyOption,
  normalizeRowCategory,
  resolveExpenseTotal,
} from '../features/expense/summary.ts'
import { duplicateRowIds, findPossibleDuplicates } from '../features/expense/duplicates.ts'
import {
  countIncompleteRows,
  findIssues,
  validateExpenseRows,
} from '../features/expense/validation.ts'
import { pdfSafe } from '../lib/exporters/pdf-kit.ts'

let rowSeq = 0

function row(overrides: Partial<ExpenseRow> = {}): ExpenseRow {
  rowSeq += 1
  return {
    id: `auto_${rowSeq}`,
    merchantName: null,
    transactionDate: null,
    invoiceNumber: null,
    currency: null,
    paymentMethod: null,
    category: 'other',
    notes: null,
    subtotal: null,
    tax: null,
    discount: null,
    grandTotal: null,
    items: [],
    needsReview: false,
    warnings: [],
    ...overrides,
  }
}

const report = expenseReportSchema.parse({
  reportName: 'September 2026',
  currency: 'IDR',
  expenses: [
    row({
      id: 'a',
      merchantName: 'TOKO SEJAHTERA',
      transactionDate: '2026-09-14',
      category: 'food_dining',
      subtotal: 215500,
      tax: 23705,
      grandTotal: 239205,
    }),
    row({
      id: 'b',
      merchantName: 'GRAB',
      transactionDate: '2026-09-15',
      category: 'transportation',
      grandTotal: 45000,
    }),
    row({
      id: 'c',
      merchantName: 'TOKO SEJAHTERA',
      transactionDate: '2026-09-14',
      category: 'food_dining',
      grandTotal: 239205,
    }),
  ],
})

// ── totals ──

test('a printed grand total wins over the arithmetic fallback', () => {
  const total = resolveExpenseTotal(
    row({ subtotal: 100, tax: 10, grandTotal: 999 }),
  )
  assert.equal(total, 999)
})

test('subtotal + tax - discount is only a fallback', () => {
  assert.equal(resolveExpenseTotal(row({ subtotal: 100, tax: 10, discount: 5 })), 105)
  assert.equal(resolveExpenseTotal(row({ tax: 10, discount: 5 })), 5)
})

test('items are the last resort before the row counts as unreadable', () => {
  const withItems = row({
    tax: 10,
    items: [{ name: 'Kopi', quantity: 2, unitPrice: 5000, total: 10000 }],
  })
  assert.equal(resolveExpenseTotal(withItems), 10010)
  assert.equal(hasReadableTotal(withItems), true)
  assert.equal(hasReadableTotal(row({})), false)
})

test('summary totals and percentages add up', () => {
  const summary = buildExpenseSummary(report)

  assert.equal(summary.receiptCount, 3)
  assert.equal(summary.totalSubtotal, 215500)
  assert.equal(summary.totalTax, 23705)
  assert.equal(summary.totalExpenses, 239205 + 45000 + 239205)

  const food = summary.categories.find((entry) => entry.category === 'food_dining')
  assert.ok(food)
  assert.equal(food.count, 2)
  assert.equal(food.amount, 239205 * 2)

  const totalPercentage = summary.categories.reduce((sum, e) => sum + e.percentage, 0)
  assert.ok(Math.abs(totalPercentage - 100) < 0.5, `percentages summed to ${totalPercentage}`)
})

test('an empty report never divides by zero', () => {
  const summary = buildExpenseSummary({ reportName: 'Kosong', currency: null, expenses: [] })
  assert.equal(summary.totalExpenses, 0)
  assert.equal(summary.categories.length, 0)
})

test('summary flags rows that still need review', () => {
  const summary = buildExpenseSummary({
    reportName: 'x',
    currency: 'IDR',
    expenses: [row({ id: 'a', grandTotal: 10, needsReview: true })],
  })
  assert.equal(summary.needsReviewCount, 1)
})

test('normalizeRowCategory uses merchant and item names as a keyword fallback', () => {
  assert.equal(
    normalizeRowCategory(row({ category: null, merchantName: 'STARBUCKS' })),
    'food_dining',
  )
  assert.equal(
    normalizeRowCategory(row({ category: null, merchantName: 'TOKO', items: [{ name: 'Kertas A4', quantity: 1, unitPrice: 50000, total: 50000 }] })),
    'office_supplies',
  )
})

test('isCurrencyOption guards the report currency selector', () => {
  assert.equal(isCurrencyOption('IDR'), true)
  assert.equal(isCurrencyOption('XYZ'), false)
  assert.equal(isCurrencyOption(null), false)
})

// ── duplicates ──

test('identical receipts on the same day are flagged once as a group', () => {
  const groups = findPossibleDuplicates(report.expenses)
  assert.equal(groups.length, 1)
  assert.deepEqual(groups[0].ids.sort(), ['a', 'c'])
  assert.deepEqual([...duplicateRowIds(groups)].sort(), ['a', 'c'])
})

test('the same receipt is still caught when the total differs by a rounding step', () => {
  // This is the case an exact-key lookup would miss.
  const rows = [
    row({ id: 'a', merchantName: 'TOKO SEJAHTERA', transactionDate: '2026-09-14', grandTotal: 100 }),
    row({ id: 'b', merchantName: 'Toko Sejahtera', transactionDate: '2026-09-14', grandTotal: 100.5 }),
  ]
  const groups = findPossibleDuplicates(rows)
  assert.equal(groups.length, 1)
  assert.deepEqual(groups[0].ids.sort(), ['a', 'b'])
})

test('a missing date on one side still allows a match', () => {
  const rows = [
    row({ id: 'a', merchantName: 'KAFE', transactionDate: null, grandTotal: 25000 }),
    row({ id: 'b', merchantName: 'KAFE', transactionDate: '2026-09-01', grandTotal: 25000 }),
  ]
  assert.equal(findPossibleDuplicates(rows).length, 1)
})

test('different days, different merchants, or different amounts are not duplicates', () => {
  const rows = [
    row({ id: 'a', merchantName: 'KAFE', transactionDate: '2026-09-01', grandTotal: 25000 }),
    row({ id: 'b', merchantName: 'KAFE', transactionDate: '2026-09-02', grandTotal: 25000 }),
    row({ id: 'c', merchantName: 'TOKO', transactionDate: '2026-09-01', grandTotal: 25000 }),
    row({ id: 'd', merchantName: 'KAFE', transactionDate: '2026-09-01', grandTotal: 90000 }),
  ]
  assert.deepEqual(findPossibleDuplicates(rows), [])
})

test('rows without a merchant or without a total are never accused', () => {
  const rows = [
    row({ id: 'a', merchantName: null, grandTotal: 100 }),
    row({ id: 'b', merchantName: null, grandTotal: 100 }),
    row({ id: 'c', merchantName: 'KAFE', grandTotal: 0 }),
    row({ id: 'd', merchantName: 'KAFE', grandTotal: 0 }),
  ]
  assert.deepEqual(findPossibleDuplicates(rows), [])
})

test('three copies are reported as a single group, not three groups', () => {
  const rows = [
    row({ id: 'a', merchantName: 'KAFE', transactionDate: '2026-09-01', grandTotal: 25000 }),
    row({ id: 'b', merchantName: 'KAFE', transactionDate: '2026-09-01', grandTotal: 25000 }),
    row({ id: 'c', merchantName: 'KAFE', transactionDate: '2026-09-01', grandTotal: 25000 }),
  ]
  const groups = findPossibleDuplicates(rows)
  assert.equal(groups.length, 1)
  assert.equal(groups[0].ids.length, 3)
})

// ── validation ──

test('a row missing a critical field is reported as incomplete', () => {
  const issues = findIssues(row({ id: 'a' }))
  assert.ok(issues.includes('date'))
  assert.ok(issues.includes('merchant'))
  assert.ok(issues.includes('total'))
})

test('a missing category is advisory and never counts as incomplete', () => {
  const issues = findIssues(
    row({ id: 'a', merchantName: 'KAFE', transactionDate: '2026-09-01', grandTotal: 10, category: null }),
  )
  assert.ok(issues.includes('category'))
  assert.equal(
    countIncompleteRows([{ id: 'a', missing: issues }]),
    0,
  )
})

test('an unparseable date is treated as missing', () => {
  const issues = findIssues(
    row({ id: 'a', merchantName: 'KAFE', transactionDate: '2026-13-45', grandTotal: 10 }),
  )
  assert.ok(issues.includes('date'))
})

test('validateExpenseRows only returns rows that have an issue', () => {
  const issues = validateExpenseRows([
    row({ id: 'ok', merchantName: 'KAFE', transactionDate: '2026-09-01', grandTotal: 10 }),
    row({ id: 'bad' }),
  ])
  assert.equal(issues.length, 1)
  assert.equal(issues[0].id, 'bad')
  assert.equal(countIncompleteRows(issues), 1)
})

// ── pdf encoding (regression guard) ──
// Helvetica is WinAnsi-encoded and physically cannot encode `→` or `—`.
// pdf-lib THROWS at runtime on those, which `next build` never catches because
// it only type-checks. Every exporter draws through pdfSafe, so a decorated
// string (e.g. the report period `2026-09-14 -> 2026-09-18`) would otherwise
// break the whole export.

test('pdfSafe degrades typographic characters to WinAnsi-safe ASCII', () => {
  assert.equal(pdfSafe('2026-09-14 → 2026-09-18'), '2026-09-14 -> 2026-09-18')
  assert.equal(pdfSafe('Toko Sejahtera — CVS'), 'Toko Sejahtera - CVS')
  assert.equal(pdfSafe('a–b'), 'a-b')
  assert.equal(pdfSafe('“Toko” ’Sejahtera’'), '"Toko" \'Sejahtera\'')
  assert.equal(pdfSafe('wait…'), 'wait...')
  assert.equal(pdfSafe('Café'), 'Café', 'Latin-1 range must be preserved')
  // Each unencodable code point becomes one '?', never an exception.
  assert.equal(pdfSafe('☕ 日本語'), '? ???', 'unencodable chars degrade, never throw')
})

test('pdfSafe output is always within the WinAnsi printable range', () => {
  const sample = 'a'.repeat(30) + '\u2014\u2192\u2026\u2615\u00A0\u65E5'
  for (const char of pdfSafe(sample)) {
    const code = char.codePointAt(0) as number
    assert.ok(
      (code >= 0x20 && code <= 0x7e) || (code >= 0xa1 && code <= 0xff),
      `char U+${code.toString(16)} is outside WinAnsi`,
    )
  }
})
