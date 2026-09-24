/**
 * Plain, small PDF export for a validated Invoice (pdf-lib).
 * Uses only Helvetica (built-in, zero font embedding) so files stay tiny.
 * The layout mirrors the on-screen preview (same design tokens), so the PDF
 * is exactly "the preview you saw" — no rework needed.
 */

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import type { Invoice } from '@/features/invoice/schema'

const PAGE_W = 595.28
const PAGE_H = 841.89
const MARGIN = 56

const COLOR = {
  ink: rgb(0.106, 0.141, 0.188), // #1B2430
  muted: rgb(0.36, 0.39, 0.45), // #5B6270
  accent: rgb(0.878, 0.188, 0.306), // #E0304E
  line: rgb(0.89, 0.91, 0.92), // #E3E5E9
}

function fmt(value: number | null): string {
  if (value == null) return '-'
  return value.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

function money(value: number | null, currency: string | null): string {
  if (value == null) return '-'
  return currency ? `${currency} ${fmt(value)}` : fmt(value)
}

function truncate(text: string | null | undefined, max = 36): string {
  if (!text || text.trim().length === 0) return '-'
  const trimmed = text.trim()
  return trimmed.length > max ? `${trimmed.slice(0, max - 1).trim()}…` : trimmed
}

function drawText(
  page: PDFPage,
  x: number,
  y: number,
  text: string,
  font: PDFFont,
  size: number,
  color: ReturnType<typeof rgb> = COLOR.ink,
): void {
  page.drawText(text, { x, y, size, font, color })
}

function drawLine(
  page: PDFPage,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color = COLOR.line,
  width = 1,
): void {
  page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: width, color })
}

/**
 * Right-align a short value so totals line up under the amount column.
 */
function drawRight(
  page: PDFPage,
  rightX: number,
  y: number,
  text: string,
  font: PDFFont,
  size: number,
  color: ReturnType<typeof rgb> = COLOR.ink,
): void {
  const width = font.widthOfTextAtSize(text, size)
  page.drawText(text, { x: rightX - width, y, size, font, color })
}

export async function buildInvoicePdf(invoice: Invoice): Promise<Buffer> {
  const doc = await PDFDocument.create()
  const helv = await doc.embedFont(StandardFonts.Helvetica)
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold)

  const page = doc.addPage([PAGE_W, PAGE_H])

  // ── Top accent bar ──
  page.drawRectangle({ x: 0, y: PAGE_H - 6, width: PAGE_W, height: 6, color: COLOR.accent })

  let y = PAGE_H - 42

  // ── Header: seller left, INVOICE right ──
  drawText(page, PAGE_W - MARGIN - 100, y + 4, 'INVOICE', helvBold, 24)
  const sellerName = truncate(invoice.seller.name ?? invoice.buyer.name ?? 'Farisium', 30)
  drawText(page, MARGIN, y, sellerName, helvBold, 15)
  y -= 17

  let sellerY = y
  if (invoice.seller.address) {
    drawText(page, MARGIN, y, truncate(invoice.seller.address, 58), helv, 9, COLOR.muted)
    y -= 12
  }
  if (invoice.seller.taxId) {
    drawText(page, MARGIN, y, `NPWP: ${invoice.seller.taxId}`, helv, 9, COLOR.muted)
    y -= 12
  }
  if (invoice.seller.contact) {
    drawText(page, MARGIN, y, truncate(invoice.seller.contact, 58), helv, 9, COLOR.muted)
    y -= 12
  }

  // Right block: invoice meta (number, dates, currency). Values are
  // right-aligned to the page margin so long numbers cannot overflow.
  const metaX = PAGE_W - MARGIN - 175
  const metaValX = PAGE_W - MARGIN
  let metaY = sellerY
  const meta: Array<[string, string]> = [
    ['No. Invoice', invoice.invoiceNumber ?? '-'],
    ['Tanggal Terbit', invoice.issueDate ?? '-'],
    ['Jatuh Tempo', invoice.dueDate ?? '-'],
    ['Mata Uang', invoice.currency ?? '-'],
  ]
  meta.forEach(([label, value]) => {
    drawText(page, metaX, metaY, label, helvBold, 8.5, COLOR.muted)
    drawRight(page, metaValX, metaY, truncate(value, 20), helv, 9)
    metaY -= 14
  })

  const contentTop = Math.max(y, metaY) - 6

  // ── Buyer block ──
  drawText(page, MARGIN, contentTop, 'UNTUK / TO', helvBold, 9, COLOR.accent)
  let by = contentTop - 4
  const buyerLines = [
    invoice.buyer.name ?? '',
    invoice.buyer.address ?? '',
    invoice.buyer.contact ?? '',
  ].filter((line) => line.trim().length > 0)
  if (buyerLines.length === 0) buyerLines.push('-')
  buyerLines.forEach((line) => {
    by -= 14
    drawText(page, MARGIN, by, truncate(line, 72), helv, 9.5)
  })

  // ── Items table: distinct right-aligned column edges so big numbers
  // cannot collide. Amounts share the page margin line as in the preview.
  const tableTop = by - 20
  const itemX = MARGIN
  const qtyRight = 356
  const unitRight = 452
  const amountRight = PAGE_W - MARGIN

  drawText(page, itemX, tableTop, 'ITEM', helvBold, 9, COLOR.muted)
  drawRight(page, qtyRight, tableTop, 'QTY', helvBold, 9, COLOR.muted)
  drawRight(page, unitRight, tableTop, 'HARGA SATUAN', helvBold, 8.5, COLOR.muted)
  drawRight(page, amountRight, tableTop, 'TOTAL', helvBold, 9, COLOR.muted)
  drawLine(page, MARGIN, tableTop - 7, PAGE_W - MARGIN, tableTop - 7, COLOR.line, 1)

  let itemY = tableTop - 23
  invoice.items.slice(0, 20).forEach((item) => {
    drawText(page, itemX, itemY, truncate(item.name ?? item.description ?? '-', 40), helv, 9)
    drawRight(page, qtyRight, itemY, item.quantity == null ? '-' : String(item.quantity), helv, 9)
    drawRight(page, unitRight, itemY, money(item.unitPrice, null), helv, 9)
    drawRight(page, amountRight, itemY, money(item.total, null), helv, 9.5, COLOR.ink)
    itemY -= 16
  })

  if (invoice.items.length === 0) {
    drawText(page, itemX, itemY, 'Tidak ada item yang terbaca.', helv, 9, COLOR.muted)
    itemY -= 16
  }

  // ── Totals: labels left, values right-aligned to the margin; the totals
  // block starts further left than the item amounts so long numbers stay
  // clear of the labels.
  const totalsX = 360
  const totalsValX = PAGE_W - MARGIN
  let totalY = itemY - 16
  const totals: Array<[string, number | null]> = [
    ['Subtotal', invoice.subtotal],
    ['Pajak', invoice.tax],
    ['Ongkir', invoice.shipping],
    ['Diskon', invoice.discount],
  ]
  totals.forEach(([label, value]) => {
    drawText(page, totalsX, totalY, label, helv, 9)
    drawRight(page, totalsValX, totalY, money(value, invoice.currency), helv, 9)
    totalY -= 14
  })
  drawLine(page, totalsX - 4, totalY + 2, PAGE_W - MARGIN, totalY + 2, COLOR.line, 1)
  drawText(page, totalsX, totalY - 13, 'GRAND TOTAL', helvBold, 10.5)
  drawRight(page, totalsValX, totalY - 13, money(invoice.grandTotal, invoice.currency), helvBold, 10.5, COLOR.accent)
  totalY -= 36

  // ── Payment & notes ──
  if (invoice.paymentMethod) {
    drawText(page, MARGIN, totalY, 'PEMBAYARAN / PAYMENT', helvBold, 8.5, COLOR.muted)
    drawText(page, MARGIN, totalY - 14, truncate(invoice.paymentMethod, 72), helv, 9)
    totalY -= 30
  }
  if (invoice.notes) {
    drawText(page, MARGIN, totalY, 'CATATAN / NOTES', helvBold, 8.5, COLOR.muted)
    drawText(page, MARGIN, totalY - 14, truncate(invoice.notes, 76), helv, 9)
  }

  // ── Footer ──
  drawLine(page, MARGIN, 48, PAGE_W - MARGIN, 48, COLOR.line, 1)
  drawText(page, MARGIN, 36, 'Dibuat otomatis oleh Farisium', helv, 8, COLOR.muted)

  const bytes = await doc.save({ useObjectStreams: true })
  return Buffer.from(bytes)
}