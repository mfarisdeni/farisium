import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  DAILY_CONVERSION_LIMIT,
  DAILY_LIMITS,
  EXPENSE_FEATURE,
  INVOICE_FEATURE,
  KNOWN_FEATURES,
  RECEIPT_FEATURE,
  getDailyLimit,
  isKnownFeature,
} from '../lib/limits.ts'
import { MAX_REPORT_ITEMS } from '../features/expense/schema.ts'
import { MAX_FILE_SIZE_BYTES } from '../lib/r2/keys.ts'

/**
 * These assertions lock the product policy a user actually sees. Changing a
 * limit is a deliberate product decision, so it should fail here first and
 * force the UI copy and docs to be updated with it.
 */
test('daily budgets match the shipped policy', () => {
  assert.equal(DAILY_CONVERSION_LIMIT, 10)
  assert.equal(DAILY_LIMITS[RECEIPT_FEATURE], 10, 'receipt: 10/day')
  assert.equal(DAILY_LIMITS[INVOICE_FEATURE], 10, 'invoice: 10/day')
  assert.equal(DAILY_LIMITS[EXPENSE_FEATURE], 20, 'expense report: 20 receipts/day')
})

test('every known feature has a positive budget and resolves via getDailyLimit', () => {
  for (const feature of KNOWN_FEATURES) {
    assert.ok(DAILY_LIMITS[feature] > 0, `${feature} needs a positive budget`)
    assert.equal(getDailyLimit(feature), DAILY_LIMITS[feature])
  }
})

test('upload caps match the shipped policy', () => {
  assert.equal(MAX_FILE_SIZE_BYTES, 5 * 1024 * 1024, '5 MB per image')
  assert.equal(MAX_REPORT_ITEMS, 10, '10 receipts per report')
})

test('the expense daily budget covers exactly one full report', () => {
  assert.ok(
    DAILY_LIMITS[EXPENSE_FEATURE] % MAX_REPORT_ITEMS === 0,
    'a whole number of reports should fit in the daily budget',
  )
})

test('isKnownFeature rejects unknown values', () => {
  assert.equal(isKnownFeature(RECEIPT_FEATURE), true)
  assert.equal(isKnownFeature('nope'), false)
  assert.equal(isKnownFeature(undefined), false)
  assert.equal(isKnownFeature(null), false)
})
