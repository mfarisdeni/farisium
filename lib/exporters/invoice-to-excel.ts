/**
 * Excel export for a validated Invoice (ExcelJS).
 * Professional but deliberately plain: no background fills, black text on a
 * white sheet — readable and editable in any spreadsheet app (Excel, Google
 * Sheets, LibreOffice, dark-theme viewers).
 */

import ExcelJS from 'exceljs'
import type { Invoice } from '@/features/invoice/schema'

const BLACK: Partial<ExcelJS.Font> = { color: { argb: 'FF000000' } }
const BOLD: Partial<ExcelJS.Font> = { bold: true, color: { argb: 'FF000000' } }

function formatNumber(value: number | null): string {
  if (value == null) return '-'
  return value.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

function formatAmount(value: number | null, currency: string | null): string {
  if (value == null) return '-'
  return currency ? `${currency} ${formatNumber(value)}` : formatNumber(value)
}

function writePair(
  ws: ExcelJS.Worksheet,
  row: number,
  label: string,
  value: string,
  labelWidth = true,
): void {
  const a = ws.getCell(row, 1)
  const b = ws.getCell(row, 2)
  a.value = label
  a.font = BOLD
  b.value = value
  b.font = BLACK
  ws.mergeCells(row, 2, row, 4)
  if (labelWidth) a.alignment = { vertical: 'top' }
  b.alignment = { wrapText: true, vertical: 'top' }
}

export async function buildInvoiceWorkbook(invoice: Invoice): Promise<Buffer> {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'Farisium'
  wb.created = new Date()
  wb.modified = new Date()

  const ws = wb.addWorksheet('Invoice', {
    views: [{ state: 'frozen', ySplit: 1 }],
  })

  ws.columns = [
    { key: 'a', width: 24 },
    { key: 'b', width: 9 },
    { key: 'c', width: 15 },
    { key: 'd', width: 18 },
  ]

  // ── Title ──
  ws.mergeCells('A1:D1')
  const titleCell = ws.getCell('A1')
  titleCell.value = invoice.invoiceNumber ? `INVOICE  ·  ${invoice.invoiceNumber}` : 'INVOICE'
  titleCell.font = { bold: true, size: 16, color: { argb: 'FF000000' } }
  ws.getRow(1).height = 26

  // ── Meta ──
  let row = 3
  writePair(ws, row, 'No. Invoice', invoice.invoiceNumber ?? '-'); row += 1
  writePair(ws, row, 'Tanggal Terbit', invoice.issueDate ?? '-'); row += 1
  writePair(ws, row, 'Jatuh Tempo', invoice.dueDate ?? '-'); row += 1
  writePair(ws, row, 'Mata Uang', invoice.currency ?? '-'); row += 2

  // ── Seller ──
  ws.getCell(row, 1).value = 'DARI / FROM'
  ws.getCell(row, 1).font = BOLD
  row += 1
  writePair(ws, row, 'Nama', invoice.seller.name ?? '-'); row += 1
  writePair(ws, row, 'Alamat', invoice.seller.address ?? '-'); row += 1
  writePair(ws, row, 'Kontak', invoice.seller.contact ?? '-'); row += 1
  if (invoice.seller.taxId) {
    writePair(ws, row, 'NPWP / Tax ID', invoice.seller.taxId); row += 1
  }
  row += 1

  // ── Buyer ──
  ws.getCell(row, 1).value = 'UNTUK / TO'
  ws.getCell(row, 1).font = BOLD
  row += 1
  writePair(ws, row, 'Nama', invoice.buyer.name ?? '-'); row += 1
  writePair(ws, row, 'Alamat', invoice.buyer.address ?? '-'); row += 1
  writePair(ws, row, 'Kontak', invoice.buyer.contact ?? '-'); row += 2

  // ── Item table header ──
  const headerRow = ws.getRow(row)
  ;['Item', 'Qty', 'Harga Satuan', 'Total'].forEach((label, index) => {
    const cell = headerRow.getCell(index + 1)
    cell.value = label
    cell.font = BOLD
    if (index >= 1) cell.alignment = { horizontal: index === 1 ? 'center' : 'right' }
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF9CA3AF' } },
      bottom: { style: 'thin', color: { argb: 'FF9CA3AF' } },
    }
  })
  headerRow.commit()
  row += 1

  // ── Items ──
  invoice.items.forEach((item) => {
    const r = ws.getRow(row)
    r.getCell(1).value = item.name ?? item.description ?? '-'
    r.getCell(1).font = BLACK
    r.getCell(2).value = item.quantity
    r.getCell(2).numFmt = '#,##0.##'
    r.getCell(2).alignment = { horizontal: 'center' }
    r.getCell(2).font = BLACK
    r.getCell(3).value = item.unitPrice
    r.getCell(3).numFmt = '#,##0.00'
    r.getCell(3).alignment = { horizontal: 'right' }
    r.getCell(3).font = BLACK
    r.getCell(4).value = item.total
    r.getCell(4).numFmt = '#,##0.00'
    r.getCell(4).alignment = { horizontal: 'right' }
    r.getCell(4).font = BLACK
    r.commit()
    row += 1
  })

  if (invoice.items.length === 0) {
    ws.mergeCells(row, 1, row, 4)
    ws.getCell(row, 1).value = 'Tidak ada item yang terbaca.'
    ws.getCell(row, 1).font = { italic: true, color: { argb: 'FF6B7280' } }
    row += 1
  }

  row += 1

  // ── Summary ──
  const taxLabel = invoice.taxRate
    ? `Pajak / Tax (${formatNumber(invoice.taxRate)}%)`
    : 'Pajak / Tax'
  const summaryRows: Array<[string, number | null, boolean]> = [
    ['Subtotal', invoice.subtotal, false],
    [taxLabel, invoice.tax, false],
    ['Ongkir / Shipping', invoice.shipping, false],
    ['Diskon / Discount', invoice.discount, false],
    ['Grand Total', invoice.grandTotal, true],
  ]

  summaryRows.forEach(([label, value, isTotal]) => {
    const r = ws.getRow(row)
    r.getCell(1).value = label
    r.getCell(1).font = isTotal ? { bold: true, size: 12, color: { argb: 'FF000000' } } : BOLD
    r.getCell(1).alignment = { horizontal: 'right' }
    ws.mergeCells(row, 1, row, 3)
    const amountCell = r.getCell(4)
    if (isTotal) {
      amountCell.value = formatAmount(value, invoice.currency)
      amountCell.font = { bold: true, size: 12, color: { argb: 'FF000000' } }
      amountCell.border = { top: { style: 'thin', color: { argb: 'FF9CA3AF' } } }
    } else {
      amountCell.value = formatAmount(value, invoice.currency)
      amountCell.font = BLACK
    }
    amountCell.alignment = { horizontal: 'right' }
    r.commit()
    row += 1
  })

  // ── Payment & notes ──
  row += 1
  if (invoice.paymentMethod) {
    writePair(ws, row, 'Pembayaran', invoice.paymentMethod)
    row += 1
  }
  if (invoice.notes) {
    writePair(ws, row, 'Catatan', invoice.notes)
    row += 1
  }

  // ── Warnings (if any) ──
  if (invoice.warnings.length > 0) {
    row += 1
    ws.getCell(row, 1).value = 'Perlu Review / Needs Review'
    ws.getCell(row, 1).font = { bold: true, color: { argb: 'FFB45309' } }
    row += 1
    invoice.warnings.forEach((warning) => {
      ws.mergeCells(row, 1, row, 4)
      ws.getCell(row, 1).value = `• ${warning}`
      ws.getCell(row, 1).font = { color: { argb: 'FFB45309' } }
      row += 1
    })
  }

  const buffer = await wb.xlsx.writeBuffer()
  return Buffer.from(buffer)
}