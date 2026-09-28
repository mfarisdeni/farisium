/**
 * Excel export for a reviewed product catalog (ExcelJS).
 * Deterministic formatting — no AI involvement, all numbers come from
 * `features/product-catalog/summary.ts` so Excel always matches the review
 * screen.
 *
 * Styling follows the receipt & expense workbooks: no background fills, black
 * text on a white sheet, so the file stays readable in any spreadsheet app.
 */

import ExcelJS from 'exceljs'
import { buildCatalogSummary, catalogDocumentNames } from '@/features/product-catalog/summary'
import type { CatalogReport } from '@/features/product-catalog/schema'
import {
  countIncompleteRows,
  findCatalogIssues,
  validateCatalogRows,
} from '@/features/product-catalog/validation'

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

function autoFilter(ws: ExcelJS.Worksheet, fromRow: number, toRow: number, columns: number) {
  if (toRow < fromRow) return
  ws.autoFilter = {
    from: { row: fromRow, column: 1 },
    to: { row: toRow, column: columns },
  }
}

export async function buildCatalogWorkbook(report: CatalogReport): Promise<Buffer> {
  const summary = buildCatalogSummary(report)
  const currency = summary.currency
  const incomplete = countIncompleteRows(validateCatalogRows(report.products))

  const wb = new ExcelJS.Workbook()
  wb.creator = 'Farisium'
  wb.created = new Date()
  wb.modified = new Date()

  // ── Sheet 1 — Catalog ──
  const ws = wb.addWorksheet('Catalog', {
    views: [{ state: 'frozen', ySplit: 5 }],
  })

  ws.columns = [
    { key: 'no', width: 6 },
    { key: 'name', width: 40 },
    { key: 'variant', width: 26 },
    { key: 'store', width: 24 },
    { key: 'brand', width: 18 },
    { key: 'category', width: 18 },
    { key: 'price', width: 14 },
    { key: 'originalPrice', width: 16 },
    { key: 'discount', width: 12 },
    { key: 'rating', width: 10 },
    { key: 'sold', width: 16 },
    { key: 'sku', width: 18 },
    { key: 'source', width: 22 },
    { key: 'notes', width: 28 },
    { key: 'review', width: 14 },
  ]

  ws.mergeCells('A1:O1')
  const title = ws.getCell('A1')
  title.value = 'FARISIUM — PRODUCT CATALOG'
  title.font = { bold: true, size: 14, color: INK }
  ws.getRow(1).height = 24

  ws.getCell('A2').value = 'Catalog Name'
  ws.getCell('A2').font = { bold: true, color: INK }
  ws.mergeCells('B2:O2')
  ws.getCell('B2').value = report.catalogName
  ws.getCell('B2').font = { color: INK }

  ws.getCell('A3').value = 'Source'
  ws.getCell('A3').font = { bold: true, color: INK }
  ws.mergeCells('B3:O3')
  ws.getCell('B3').value = report.source ?? '-'
  ws.getCell('B3').font = { color: MUTED }

  ws.getCell('A4').value = 'Generated'
  ws.getCell('A4').font = { bold: true, color: INK }
  ws.mergeCells('B4:O4')
  ws.getCell('B4').value = new Date().toISOString().slice(0, 10)
  ws.getCell('B4').font = { color: MUTED }

  const headers = [
    '#',
    'Product',
    'Variant / Spec',
    'Store',
    'Brand',
    'Category',
    'Price',
    'Original Price',
    'Discount %',
    'Rating',
    'Sold',
    'SKU',
    'Source File',
    'Notes',
    'Review',
  ]
  const headerRow = ws.getRow(5)
  headers.forEach((text, index) => {
    const cell = headerRow.getCell(index + 1)
    cell.value = text
    cell.font = { bold: true, size: 11, color: INK }
    cell.border = { bottom: { style: 'thin', color: { argb: 'FF374151' } } }
  })
  headerRow.commit()

  report.products.forEach((row, index) => {
    const sheetRow = ws.getRow(6 + index)
    sheetRow.getCell(1).value = index + 1
    sheetRow.getCell(2).value = row.name ?? '-'
    sheetRow.getCell(3).value = row.variant ?? '-'
    sheetRow.getCell(4).value = row.store ?? '-'
    sheetRow.getCell(5).value = row.brand ?? '-'
    sheetRow.getCell(6).value = row.category ?? '-'
    sheetRow.getCell(7).value = row.price
    sheetRow.getCell(8).value = row.originalPrice
    sheetRow.getCell(9).value = row.discountPercent
    sheetRow.getCell(10).value = row.rating
    sheetRow.getCell(11).value = row.soldCount ?? '-'
    sheetRow.getCell(12).value = row.sku ?? '-'
    sheetRow.getCell(13).value = row.sourceFile ?? '-'
    sheetRow.getCell(14).value = row.notes ?? '-'

    // The same issue codes the review screen shows, not a second copy of the
    // rules: a row can now also be flagged for a marketplace name in the store
    // column or an out-of-range rating/discount.
    const issues = findCatalogIssues(row)
    sheetRow.getCell(15).value = issues.length > 0 ? `Check: ${issues.join(', ')}` : 'OK'
    sheetRow.getCell(15).font = { color: issues.length > 0 ? WARN : MUTED }

    for (const column of [7, 8]) sheetRow.getCell(column).numFmt = '#,##0.##'
    sheetRow.getCell(9).numFmt = '0'
    sheetRow.getCell(10).numFmt = '0.0'
    for (let column = 1; column <= 14; column += 1) {
      sheetRow.getCell(column).font = { color: INK }
    }
    sheetRow.getCell(7).font = { bold: true, color: INK }
    sheetRow.commit()
  })

  autoFilter(ws, 5, 5 + report.products.length, headers.length)

  // ── Totals row ──
  const totalsRow = ws.getRow(7 + report.products.length)
  totalsRow.getCell(2).value = 'TOTAL LISTED VALUE'
  totalsRow.getCell(2).font = { bold: true, size: 12, color: INK }
  totalsRow.getCell(7).value = summary.totalValue
  totalsRow.getCell(7).numFmt = '#,##0.##'
  totalsRow.getCell(7).font = { bold: true, size: 12, color: INK }
  totalsRow.getCell(14).value = label(summary.totalValue, currency)
  totalsRow.getCell(14).font = { bold: true, color: INK }
  totalsRow.commit()

  // ── Sheet 2 — Stores ──
  const stores = wb.addWorksheet('Stores')
  stores.columns = [
    { key: 'store', width: 30 },
    { key: 'products', width: 14 },
    { key: 'priced', width: 14 },
    { key: 'value', width: 20 },
    { key: 'share', width: 14 },
  ]

  stores.getCell('A1').value = 'PRODUCTS PER STORE'
  stores.getCell('A1').font = { bold: true, size: 14, color: INK }
  stores.getRow(1).height = 24

  const storeHeader = stores.getRow(3)
  ;['Store', 'Products', 'With Price', 'Total Value', 'Share'].forEach((text, index) => {
    const cell = storeHeader.getCell(index + 1)
    cell.value = text
    cell.font = { bold: true, color: INK }
    cell.border = { bottom: { style: 'thin', color: { argb: 'FF374151' } } }
  })
  storeHeader.commit()

  summary.stores.forEach((entry, index) => {
    const row = stores.getRow(4 + index)
    row.getCell(1).value = entry.name ?? '(no store printed)'
    row.getCell(2).value = entry.productCount
    row.getCell(3).value = entry.pricedCount
    row.getCell(4).value = entry.totalValue
    row.getCell(5).value = entry.percentage / 100
    row.getCell(4).numFmt = '#,##0.##'
    row.getCell(5).numFmt = '0.0%'
    for (let column = 1; column <= 4; column += 1) {
      row.getCell(column).font = { color: INK }
    }
    row.getCell(5).font = { color: MUTED }
    row.commit()
  })

  // ── Sheet 3 — Summary ──
  const sum = wb.addWorksheet('Summary')
  sum.columns = [
    { key: 'a', width: 30 },
    { key: 'b', width: 24 },
  ]

  sum.getCell('A1').value = 'CATALOG SUMMARY'
  sum.getCell('A1').font = { bold: true, size: 14, color: INK }
  sum.getRow(1).height = 24

  const meta: Array<[string, string]> = [
    ['Catalog Name', report.catalogName],
    ['Source', report.source ?? '-'],
    ['Generated', new Date().toISOString().slice(0, 10)],
    ['Currency', currency ?? '-'],
    ['Products', String(summary.productCount)],
    ['Products With Price', String(summary.pricedCount)],
    ['Discounted Products', String(summary.discountedCount)],
    ['Total Listed Value', label(summary.totalValue, currency)],
    ['Lowest Price', label(summary.minPrice, currency)],
    ['Highest Price', label(summary.maxPrice, currency)],
    ['Average Price', label(summary.averagePrice, currency)],
    ['Shops', String(summary.shopCount)],
    ['Rows Needing Check', String(incomplete)],
    ['Source Documents', catalogDocumentNames(report.products).join(', ') || '-'],
    ...(report.failedFiles.length > 0 ? ([['Failed Documents', report.failedFiles.join(', ')]] as Array<[string, string]>) : []),
  ]

  meta.forEach(([key, value], index) => {
    const row = sum.getRow(3 + index)
    row.getCell(1).value = key
    row.getCell(1).font = { bold: true, color: INK }
    row.getCell(2).value = value
    row.getCell(2).font = { color: MUTED }
  })

  const buffer = await wb.xlsx.writeBuffer()
  return Buffer.from(buffer)
}
