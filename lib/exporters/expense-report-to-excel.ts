/**
 * Excel export for a reviewed AI Expense Report (ExcelJS).
 * Deterministic formatting — no AI involvement, all numbers come from
 * `features/expense/summary.ts` so Excel always matches the review screen.
 *
 * Styling follows the receipt workbook: no background fills, black text on a
 * white sheet, so the file stays readable in any spreadsheet app.
 */

import ExcelJS from 'exceljs'
import { CATEGORY_LABELS, type ExpenseCategory } from '@/features/expense/categories'
import { buildExpenseSummary, normalizeRowCategory, resolveExpenseTotal } from '@/features/expense/summary'
import type { ExpenseReport } from '@/features/expense/schema'
import { validateExpenseRows } from '@/features/expense/validation'

const INK = { argb: 'FF000000' }
const MUTED = { argb: 'FF5B6270' }
const WARN = { argb: 'FFB45309' }

function label(value: number | null | undefined, currency: string | null): string {
  if (value == null) return '-'
  const formatted = value.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  return currency ? `${currency} ${formatted}` : formatted
}

function categoryName(category: ExpenseCategory): string {
  return CATEGORY_LABELS[category].en
}

function autoFilter(ws: ExcelJS.Worksheet, fromRow: number, toRow: number, columns: number) {
  if (toRow < fromRow) return
  ws.autoFilter = {
    from: { row: fromRow, column: 1 },
    to: { row: toRow, column: columns },
  }
}

export async function buildExpenseReportWorkbook(report: ExpenseReport): Promise<Buffer> {
  const summary = buildExpenseSummary(report)
  const currency = summary.currency
  const issues = validateExpenseRows(report.expenses)
  const incomplete = new Set(
    issues.filter((issue) =>
      issue.missing.some((field) => field === 'date' || field === 'merchant' || field === 'total'),
    ).map((issue) => issue.id),
  )

  const wb = new ExcelJS.Workbook()
  wb.creator = 'Farisium'
  wb.created = new Date()
  wb.modified = new Date()

  // ── Sheet 1 — Expense Report ──
  const ws = wb.addWorksheet('Expense Report', {
    views: [{ state: 'frozen', ySplit: 4 }],
  })

  ws.columns = [
    { key: 'date', width: 14 },
    { key: 'merchant', width: 30 },
    { key: 'invoiceNumber', width: 18 },
    { key: 'category', width: 22 },
    { key: 'paymentMethod', width: 18 },
    { key: 'subtotal', width: 16 },
    { key: 'tax', width: 14 },
    { key: 'discount', width: 14 },
    { key: 'total', width: 18 },
    { key: 'notes', width: 30 },
    { key: 'review', width: 14 },
  ]

  ws.mergeCells('A1:K1')
  const title = ws.getCell('A1')
  title.value = 'FARISIUM — EXPENSE REPORT'
  title.font = { bold: true, size: 14, color: INK }
  ws.getRow(1).height = 24

  ws.getCell('A2').value = 'Report Name'
  ws.getCell('A2').font = { bold: true, color: INK }
  ws.mergeCells('B2:K2')
  ws.getCell('B2').value = report.reportName
  ws.getCell('B2').font = { color: INK }

  ws.getCell('A3').value = 'Generated'
  ws.getCell('A3').font = { bold: true, color: INK }
  ws.mergeCells('B3:K3')
  ws.getCell('B3').value = new Date().toISOString().slice(0, 10)
  ws.getCell('B3').font = { color: MUTED }

  const headers = [
    'Date',
    'Merchant',
    'Receipt No.',
    'Category',
    'Payment Method',
    'Subtotal',
    'Tax',
    'Discount',
    'Total',
    'Notes',
    'Review',
  ]
  const headerRow = ws.getRow(4)
  headers.forEach((text, index) => {
    const cell = headerRow.getCell(index + 1)
    cell.value = text
    cell.font = { bold: true, size: 11, color: INK }
    cell.border = { bottom: { style: 'thin', color: { argb: 'FF374151' } } }
  })
  headerRow.commit()

  report.expenses.forEach((row, index) => {
    const sheetRow = ws.getRow(5 + index)
    const total = resolveExpenseTotal(row)
    sheetRow.getCell(1).value = row.transactionDate ?? '-'
    sheetRow.getCell(2).value = row.merchantName ?? '-'
    sheetRow.getCell(3).value = row.invoiceNumber ?? '-'
    sheetRow.getCell(4).value = categoryName(normalizeRowCategory(row))
    sheetRow.getCell(5).value = row.paymentMethod ?? '-'
    sheetRow.getCell(6).value = row.subtotal
    sheetRow.getCell(7).value = row.tax
    sheetRow.getCell(8).value = row.discount
    sheetRow.getCell(9).value = total
    sheetRow.getCell(10).value = row.notes ?? '-'

    const flags: string[] = []
    if (incomplete.has(row.id)) flags.push('Missing field')
    if (row.needsReview) flags.push('Check arithmetic')
    sheetRow.getCell(11).value = flags.length > 0 ? flags.join(', ') : 'OK'
    sheetRow.getCell(11).font = { color: flags.length > 0 ? WARN : MUTED }

    for (let column = 6; column <= 9; column += 1) {
      sheetRow.getCell(column).numFmt = '#,##0.##'
    }
    for (let column = 1; column <= 10; column += 1) {
      sheetRow.getCell(column).font = { color: INK }
    }
    sheetRow.getCell(9).font = { bold: true, color: INK }
    sheetRow.commit()
  })

  autoFilter(ws, 4, 4 + report.expenses.length, headers.length)

  // ── Totals row ──
  const totalsRowIndex = 6 + report.expenses.length
  const totalsRow = ws.getRow(totalsRowIndex)
  totalsRow.getCell(1).value = 'TOTAL'
  totalsRow.getCell(1).font = { bold: true, size: 12, color: INK }
  totalsRow.getCell(6).value = summary.totalSubtotal
  totalsRow.getCell(7).value = summary.totalTax
  totalsRow.getCell(8).value = summary.totalDiscount
  totalsRow.getCell(9).value = summary.totalExpenses
  for (let column = 6; column <= 9; column += 1) {
    totalsRow.getCell(column).numFmt = '#,##0.##'
    totalsRow.getCell(column).font = { bold: true, size: 12, color: INK }
  }
  totalsRow.getCell(10).value = label(summary.totalExpenses, currency)
  totalsRow.getCell(10).font = { bold: true, color: INK }
  totalsRow.commit()

  // ── Sheet 2 — Summary ──
  const sum = wb.addWorksheet('Summary')
  sum.columns = [
    { key: 'a', width: 30 },
    { key: 'b', width: 22 },
    { key: 'c', width: 14 },
  ]

  sum.getCell('A1').value = 'EXPENSE SUMMARY'
  sum.getCell('A1').font = { bold: true, size: 14, color: INK }
  sum.getRow(1).height = 24

  const meta: Array<[string, string]> = [
    ['Report Name', report.reportName],
    ['Report Period', periodLabel(report)],
    ['Generated', new Date().toISOString().slice(0, 10)],
    ['Currency', currency ?? '-'],
    ['Total Receipts', String(summary.receiptCount)],
    ['Total Subtotal', label(summary.totalSubtotal, currency)],
    ['Total Tax', label(summary.totalTax, currency)],
    ['Total Discount', label(summary.totalDiscount, currency)],
    ['Total Expenses', label(summary.totalExpenses, currency)],
  ]
  meta.forEach(([key, value], index) => {
    const row = sum.getRow(3 + index)
    row.getCell(1).value = key
    row.getCell(1).font = { bold: true, color: INK }
    row.getCell(2).value = value
    row.getCell(2).font = { color: key === 'Total Expenses' ? INK : MUTED }
    if (key === 'Total Expenses') {
      row.getCell(1).font = { bold: true, size: 12, color: INK }
      row.getCell(2).font = { bold: true, size: 12, color: INK }
    }
  })

  const breakdownHeaderRow = 3 + meta.length + 2
  const breakdownHeader = sum.getRow(breakdownHeaderRow)
  ;['Category', 'Amount', 'Percentage'].forEach((text, index) => {
    const cell = breakdownHeader.getCell(index + 1)
    cell.value = text
    cell.font = { bold: true, color: INK }
    cell.border = { bottom: { style: 'thin', color: { argb: 'FF374151' } } }
  })
  breakdownHeader.commit()

  summary.categories.forEach((entry, index) => {
    const row = sum.getRow(breakdownHeaderRow + 1 + index)
    row.getCell(1).value = categoryName(entry.category)
    row.getCell(2).value = label(entry.amount, currency)
    row.getCell(3).value = entry.percentage / 100
    row.getCell(3).numFmt = '0.0%'
    row.getCell(1).font = { color: INK }
    row.getCell(2).font = { color: INK }
    row.getCell(3).font = { color: MUTED }
    row.commit()
  })

  // ── Sheet 3 — Items (only when line-item data exists) ──
  if (summary.itemCount > 0) {
    const items = wb.addWorksheet('Items', { views: [{ state: 'frozen', ySplit: 1 }] })
    items.columns = [
      { key: 'date', width: 14 },
      { key: 'merchant', width: 28 },
      { key: 'item', width: 34 },
      { key: 'quantity', width: 12 },
      { key: 'unitPrice', width: 16 },
      { key: 'itemTotal', width: 16 },
      { key: 'category', width: 22 },
    ]
    const itemHeader = items.getRow(1)
    ;['Receipt Date', 'Merchant', 'Item', 'Quantity', 'Unit Price', 'Item Total', 'Category'].forEach(
      (text, index) => {
        const cell = itemHeader.getCell(index + 1)
        cell.value = text
        cell.font = { bold: true, color: INK }
        cell.border = { bottom: { style: 'thin', color: { argb: 'FF374151' } } }
      },
    )
    itemHeader.commit()

    let line = 2
    for (const row of report.expenses) {
      for (const item of row.items) {
        const sheetRow = items.getRow(line)
        sheetRow.getCell(1).value = row.transactionDate ?? '-'
        sheetRow.getCell(2).value = row.merchantName ?? '-'
        sheetRow.getCell(3).value = item.name ?? '-'
        sheetRow.getCell(4).value = item.quantity
        sheetRow.getCell(5).value = item.unitPrice
        sheetRow.getCell(6).value = item.total
        sheetRow.getCell(7).value = categoryName(normalizeRowCategory(row))
        sheetRow.getCell(4).numFmt = '#,##0.##'
        sheetRow.getCell(5).numFmt = '#,##0.00'
        sheetRow.getCell(6).numFmt = '#,##0.00'
        for (let column = 1; column <= 7; column += 1) {
          sheetRow.getCell(column).font = { color: INK }
        }
        sheetRow.commit()
        line += 1
      }
    }
    autoFilter(items, 1, line - 1, 7)
  }

  const buffer = await wb.xlsx.writeBuffer()
  return Buffer.from(buffer)
}

function periodLabel(report: ExpenseReport): string {
  const dates = report.expenses
    .map((row) => (row.transactionDate ?? '').trim())
    .filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value))
    .sort()

  if (dates.length === 0) return '-'
  const first = dates[0]
  const last = dates[dates.length - 1]
  return first === last ? first : `${first} → ${last}`
}
