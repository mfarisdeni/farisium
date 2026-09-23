import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseAmount, parseReceiptJson, receiptSchema } from '../features/receipt/schema.ts'

const VALID_RECEIPT_JSON = JSON.stringify({
  merchantName: 'Toko Berkah',
  transactionDate: '2026-09-20',
  currency: 'IDR',
  subtotal: 125000,
  tax: 12500,
  discount: 0,
  grandTotal: 137500,
  items: [
    { name: 'Beras 5kg', quantity: 2, unitPrice: 55000, total: 110000 },
    { name: 'Minyak 1L', quantity: 1, unitPrice: 15000, total: 15000 },
  ],
  needsReview: false,
  warnings: [],
})

test('parseReceiptJson accepts a valid structured receipt', () => {
  const receipt = parseReceiptJson(VALID_RECEIPT_JSON)
  assert.equal(receipt.merchantName, 'Toko Berkah')
  assert.equal(receipt.grandTotal, 137500)
  assert.equal(receipt.items.length, 2)
  assert.equal(receipt.needsReview, false)
})

test('parseReceiptJson extracts the first balanced JSON object from extra text', () => {
  const receipt = parseReceiptJson(`Sure! Here is the JSON:\n\`\`\`json\n${VALID_RECEIPT_JSON}\n\`\`\``)
  assert.equal(receipt.grandTotal, 137500)
})

test('parseReceiptJson throws on malformed / empty output', () => {
  assert.throws(() => parseReceiptJson(''), /Respons AI/)
  assert.throws(() => parseReceiptJson('Hello there, no JSON here.'), /Respons AI/)
})

test('unreadable amounts become null instead of failing the schema', () => {
  const receipt = parseReceiptJson(
    JSON.stringify({
      merchantName: '',
      transactionDate: null,
      currency: '???',
      subtotal: 'cut-off',
      tax: 'Rp -',
      discount: null,
      grandTotal: undefined,
      items: [{ name: '  ', quantity: 'x', unitPrice: false, total: null }],
    }),
  )
  assert.equal(receipt.merchantName, null)
  assert.equal(receipt.currency, '???')
  assert.equal(receipt.subtotal, null)
  assert.equal(receipt.tax, null)
  assert.equal(receipt.grandTotal, null)
  assert.equal(receipt.items[0].name, null)
  assert.equal(receipt.items[0].quantity, null)
  assert.equal(receipt.items[0].unitPrice, null)
  assert.equal(receipt.items[0].total, null)
})

test('extra unknown keys are stripped', () => {
  const receipt = receiptSchema.parse({
    merchantName: 'A',
    items: [],
    hack: 'x',
  })
  assert.ok(!('hack' in receipt))
})

test('parseAmount handles Indonesian number formats', () => {
  assert.equal(parseAmount('Rp 12.500,00'), 12500)
  assert.equal(parseAmount('12.500'), 12500)
  assert.equal(parseAmount('12,5'), 12.5)
  assert.equal(parseAmount('1.250.000'), 1250000)
  assert.equal(parseAmount('500000'), 500000)
  assert.equal(parseAmount(42), 42)
  assert.equal(parseAmount(null), null)
  assert.equal(parseAmount(''), null)
  assert.equal(parseAmount('tidak terbaca'), null)
})

test('literal "null" strings from the model are normalized to null', () => {
  const receipt = parseReceiptJson(
    JSON.stringify({
      merchantName: 'Toko',
      transactionDate: null,
      invoiceNumber: 'null',
      currency: 'IDR',
      items: [],
    }),
  )
  assert.equal(receipt.invoiceNumber, null)
})

test('schema rejects structurally wrong payloads', () => {
  assert.throws(() => receiptSchema.parse('not-an-object'))
  assert.throws(() => receiptSchema.parse({ merchantName: { weird: true } }))
})