import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseInvoiceJson, invoiceSchema } from '../features/invoice/schema.ts'

const VALID_INVOICE_JSON = JSON.stringify({
  invoiceNumber: 'INV-2026-001',
  issueDate: '2026-09-20',
  dueDate: '2026-10-20',
  currency: 'IDR',
  seller: {
    name: 'CV Karya Jaya',
    address: 'Jl. Sudirman No. 12',
    contact: '0812-3456-7890',
    taxId: '12.345.678.9-012.000',
  },
  buyer: { name: 'PT Konsumen Bahagia', address: 'Jl. Thamrin No. 8' },
  items: [
    { name: 'Desain Logo', description: '2 revisi', quantity: 1, unitPrice: 1500000, total: 1500000 },
    { name: 'Hosting Tahunan', quantity: 1, unitPrice: 750000, total: 750000 },
  ],
  subtotal: 2250000,
  tax: 225000,
  shipping: 0,
  discount: 0,
  grandTotal: 2475000,
  paymentMethod: 'Transfer BCA 1234567890',
  notes: 'Terima kasih',
  needsReview: false,
  warnings: [],
})

test('parseInvoiceJson accepts a valid structured invoice', () => {
  const invoice = parseInvoiceJson(VALID_INVOICE_JSON)
  assert.equal(invoice.invoiceNumber, 'INV-2026-001')
  assert.equal(invoice.seller.name, 'CV Karya Jaya')
  assert.equal(invoice.grandTotal, 2475000)
  assert.equal(invoice.items.length, 2)
  assert.equal(invoice.paymentMethod, 'Transfer BCA 1234567890')
})

test('parseInvoiceJson extracts the first balanced JSON object from extra text', () => {
  const invoice = parseInvoiceJson(`Here:\n\`\`\`json\n${VALID_INVOICE_JSON}\n\`\`\``)
  assert.equal(invoice.grandTotal, 2475000)
})

test('parseInvoiceJson throws on malformed / empty output', () => {
  assert.throws(() => parseInvoiceJson(''), /Respons AI/)
  assert.throws(() => parseInvoiceJson('No JSON here.'), /Respons AI/)
})

test('partial invoice data is tolerated — missing parties & items default safely', () => {
  const invoice = parseInvoiceJson(
    JSON.stringify({
      invoiceNumber: 'INV-2026-002',
      issueDate: '2026-09-20',
      subtotal: 100000,
      grandTotal: 100000,
    }),
  )
  assert.equal(invoice.invoiceNumber, 'INV-2026-002')
  assert.deepEqual(invoice.items, [])
  assert.equal(invoice.seller.name, null)
  assert.equal(invoice.buyer.name, null)
  assert.equal(invoice.dueDate, null)
  assert.equal(invoice.notes, null)
})

test('unreadable amounts become null instead of failing the schema', () => {
  const invoice = parseInvoiceJson(
    JSON.stringify({
      invoiceNumber: null,
      issueDate: null,
      dueDate: null,
      currency: '???',
      seller: { name: '', taxId: 'null' },
      buyer: {},
      subtotal: 'cut-off',
      tax: 'Rp -',
      shipping: false,
      discount: '10%',
      grandTotal: undefined,
      items: [{ name: '  ', quantity: 'x', unitPrice: null, total: null }],
    }),
  )
  assert.equal(invoice.invoiceNumber, null)
  assert.equal(invoice.currency, '???')
  assert.equal(invoice.seller.name, null)
  assert.equal(invoice.seller.taxId, null)
  assert.equal(invoice.subtotal, null)
  assert.equal(invoice.grandTotal, null)
  assert.equal(invoice.items[0].name, null)
  assert.equal(invoice.items[0].unitPrice, null)
})

test('schema rejects structurally wrong payloads', () => {
  assert.throws(() => invoiceSchema.parse('not-an-object'))
  assert.throws(() => invoiceSchema.parse({ seller: { name: { weird: true } } }))
})