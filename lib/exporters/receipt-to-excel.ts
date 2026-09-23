/**
 * Excel export for a validated Receipt (ExcelJS).
 * Deterministic formatting — no AI involvement here.
 */

import ExcelJS from 'exceljs'
import type { Receipt } from '@/features/receipt/schema'

const HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF1F2030' },
}

const HEADER_FONT: Partial<ExcelJS.Font> = {
  bold: true,
  color: { argb: 'FFFFFFFF' },
  size: 11,
}

function formatLabel(value: number | null, currency: string | null): string {
  if (value == null) return '-'
  const formatted = value.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  return currency ? `${currency} ${formatted}` : formatted
}

export async function buildReceiptWorkbook(receipt: Receipt): Promise<Buffer> {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'Farisium'
  wb.created = new Date()
  wb.modified = new Date()

  const ws = wb.addWorksheet('Receipt', {
    views: [{ state: 'frozen', ySplit: 5 }],
  })

  ws.columns = [
    { key: 'name', width: 34 },
    { key: 'quantity', width: 12 },
    { key: 'unitPrice', width: 18 },
    { key: 'total', width: 20 },
  ]

  // ── Title ──
  ws.mergeCells('A1:D1')
  const titleCell = ws.getCell('A1')
  titleCell.value = receipt.merchantName ?? 'Struk Transaksi'
  titleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } }
  ws.getRow(1).height = 24

  // ── Meta rows ──
  ws.getCell('A2').value = 'Tanggal / Date'
  ws.getCell('B2').value = receipt.transactionDate ?? '-'
  ws.mergeCells('B2:D2')

  ws.getCell('A3').value = 'Mata Uang / Currency'
  ws.getCell('B3').value = receipt.currency ?? '-'
  ws.mergeCells('B3:D3')

  ws.getCell('A4').value = 'No. Struk / Receipt No.'
  ws.getCell('B4').value = receipt.invoiceNumber ?? '-'
  ws.mergeCells('B4:D4')

  ws.getCell('A2').font = { bold: true, color: { argb: 'FF9CA3AF' } }
  ws.getCell('A3').font = { bold: true, color: { argb: 'FF9CA3AF' } }
  ws.getCell('A4').font = { bold: true, color: { argb: 'FF9CA3AF' } }
  ws.getCell('B2').font = { color: { argb: 'FFFFFFFF' } }
  ws.getCell('B3').font = { color: { argb: 'FFFFFFFF' } }
  ws.getCell('B4').font = { color: { argb: 'FFFFFFFF' } }

  // ── Item table header (row 5, frozen) ──
  const headerRow = ws.getRow(5)
  const headers = ['Item', 'Qty', 'Unit Price', 'Total']
  headers.forEach((label, index) => {
    const cell = headerRow.getCell(index + 1)
    cell.value = label
    cell.font = HEADER_FONT
    cell.fill = HEADER_FILL
    cell.border = { bottom: { style: 'thin', color: { argb: 'FF374151' } } }
  })
  headerRow.commit()

  // ── Item rows ──
  receipt.items.forEach((item, index) => {
    const row = ws.getRow(6 + index)
    row.getCell(1).value = item.name ?? '-'
    row.getCell(2).value = item.quantity
    row.getCell(3).value = item.unitPrice
    row.getCell(4).value = item.total
    row.getCell(2).numFmt = '#,##0.##'
    row.getCell(3).numFmt = '#,##0.00'
    row.getCell(4).numFmt = '#,##0.00'
    if (index % 2 === 1) {
      row.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF111827' } }
      })
    }
    row.commit()
  })

  // ── Summary block ──
  const summaryStart = 6 + receipt.items.length + 1
  const summaryRows: Array<[string, number | null]> = [
    ['Subtotal', receipt.subtotal],
    ['Tax / Pajak', receipt.tax],
    ['Discount / Diskon', receipt.discount],
    ['Grand Total', receipt.grandTotal],
  ]

  summaryRows.forEach(([label, value], index) => {
    const row = ws.getRow(summaryStart + index)
    const isTotal = label === 'Grand Total'
    row.getCell(1).value = label
    row.getCell(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
    row.getCell(4).value = formatLabel(value, receipt.currency)
    row.getCell(4).font = { bold: isTotal, color: { argb: 'FFFFFFFF' } }
    row.getCell(4).alignment = { horizontal: 'right' }
    if (isTotal) {
      row.getCell(1).fill = HEADER_FILL
      row.getCell(4).fill = HEADER_FILL
    }
    row.commit()
  })

  // ── Warnings (if any) ──
  if (receipt.warnings.length > 0) {
    const warnStart = summaryStart + summaryRows.length + 1
    const warnHeader = ws.getRow(warnStart)
    warnHeader.getCell(1).value = 'Perlu Review / Needs Review'
    warnHeader.getCell(1).font = { bold: true, color: { argb: 'FFF59E0B' } }
    warnHeader.commit()

    receipt.warnings.forEach((warning, index) => {
      const row = ws.getRow(warnStart + 1 + index)
      row.getCell(1).value = `• ${warning}`
      row.getCell(1).font = { color: { argb: 'FFF59E0B' } }
      ws.mergeCells(`A${warnStart + 1 + index}:D${warnStart + 1 + index}`)
      row.commit()
    })
  }

  const buffer = await wb.xlsx.writeBuffer()
  return Buffer.from(buffer)
}