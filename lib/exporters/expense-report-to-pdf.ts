/**
 * Plain, small PDF export for a reviewed AI Expense Report (pdf-lib).
 *
 * Helvetica only (built-in, zero font embedding) and shared design tokens
 * from `pdf-kit`, so the document stays tiny and consistent with the invoice
 * PDF. Long tables flow onto new pages automatically, repeating the header row
 * and the page footer.
 */

import { PDFDocument, StandardFonts, type PDFPage, type PDFFont } from 'pdf-lib'
import { CATEGORY_LABELS } from '@/features/expense/categories'
import { buildExpenseSummary, resolveExpenseTotal } from '@/features/expense/summary'
import type { ExpenseReport } from '@/features/expense/schema'
import {
  COLOR,
  MARGIN,
  PAGE_H,
  PAGE_W,
  drawLine,
  drawRight,
  drawText,
  money,
  truncate,
} from './pdf-kit'

const ROW_H = 16
const HEADER_H = 18
const BOTTOM_LIMIT = 72

// Column right edges: amounts never share an axis with text, so long numbers
// cannot collide with the merchant column.
const COL_DATE = MARGIN
const COL_MERCHANT = MARGIN + 74
const COL_CATEGORY_RIGHT = 402
const COL_PAYMENT_RIGHT = 486
const COL_TOTAL_RIGHT = PAGE_W - MARGIN

interface Ctx {
  doc: PDFDocument
  helv: PDFFont
  helvBold: PDFFont
  currency: string | null
  pageIndex: number
}

function newPage(ctx: Ctx, accentBar: boolean) {
  const page = ctx.doc.addPage([PAGE_W, PAGE_H])
  if (accentBar) {
    page.drawRectangle({ x: 0, y: PAGE_H - 6, width: PAGE_W, height: 6, color: COLOR.accent })
  }
  ctx.pageIndex += 1
  return page
}

function drawFooter(ctx: Ctx, page: PDFPage, pageIndex: number) {
  drawLine(page, MARGIN, 48, PAGE_W - MARGIN, 48, COLOR.line, 1)
  drawText(page, MARGIN, 36, 'Dibuat otomatis oleh Farisium', ctx.helv, 8, COLOR.muted)
  drawRight(page, PAGE_W - MARGIN, 36, `Halaman ${pageIndex}`, ctx.helv, 8, COLOR.muted)
}

function drawTableHeader(ctx: Ctx, page: PDFPage, y: number) {
  const { helv, helvBold } = ctx
  drawText(page, COL_DATE, y, 'TANGGAL', helvBold, 8, COLOR.muted)
  drawText(page, COL_MERCHANT, y, 'MERCHANT', helvBold, 8, COLOR.muted)
  drawRight(page, COL_CATEGORY_RIGHT, y, 'KATEGORI', helvBold, 8, COLOR.muted)
  drawRight(page, COL_PAYMENT_RIGHT, y, 'PEMBAYARAN', helvBold, 8, COLOR.muted)
  drawRight(page, COL_TOTAL_RIGHT, y, 'TOTAL', helvBold, 8, COLOR.muted)
  drawLine(page, MARGIN, y - 7, PAGE_W - MARGIN, y - 7, COLOR.line, 1)
}

export async function buildExpenseReportPdf(report: ExpenseReport): Promise<Buffer> {
  const summary = buildExpenseSummary(report)
  const doc = await PDFDocument.create()
  const helv = await doc.embedFont(StandardFonts.Helvetica)
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold)

  const ctx: Ctx = {
    doc,
    helv,
    helvBold,
    currency: summary.currency,
    pageIndex: 0,
  }

  // ── Page 1: cover block + summary + first table rows ──
  let page = newPage(ctx, true)
  let y = PAGE_H - 44

  drawText(page, MARGIN, y, 'FARISIUM', helvBold, 10, COLOR.accent)
  drawRight(page, PAGE_W - MARGIN, y, 'EXPENSE REPORT', helvBold, 20)
  y -= 14
  drawLine(page, MARGIN, y, PAGE_W - MARGIN, y, COLOR.line, 1)
  y -= 18

  // Report meta (label left, value right-aligned to the margin).
  const meta: Array<[string, string]> = [
    ['Nama Laporan / Report Name', truncate(report.reportName, 34)],
    ['Periode / Report Period', periodLabel(report)],
    ['Tanggal Cetak / Generated', new Date().toISOString().slice(0, 10)],
    ['Mata Uang / Currency', summary.currency ?? '-'],
  ]
  meta.forEach(([label, value]) => {
    drawText(page, MARGIN, y, label, helvBold, 8.5, COLOR.muted)
    drawRight(page, PAGE_W - MARGIN, y, value, helv, 9)
    y -= 14
  })

  y -= 10
  // Headline figures: total expenses + receipt count.
  drawText(page, MARGIN, y, 'TOTAL EXPENSES', helvBold, 8.5, COLOR.muted)
  drawRight(page, PAGE_W - MARGIN, y - 4, money(summary.totalExpenses, summary.currency), helvBold, 18, COLOR.accent)
  drawRight(page, PAGE_W - MARGIN, y + 8, `${summary.receiptCount} struk / receipts`, helv, 8, COLOR.muted)
  y -= 26

  // ── Totals strip ──
  const strip: Array<[string, number]> = [
    ['Subtotal', summary.totalSubtotal],
    ['Pajak / Tax', summary.totalTax],
    ['Diskon / Discount', summary.totalDiscount],
  ]
  strip.forEach(([label, value]) => {
    drawText(page, MARGIN, y, label, helv, 9)
    drawRight(page, PAGE_W - MARGIN, y, money(value, summary.currency), helv, 9)
    y -= 13
  })
  y -= 8

  // ── Category breakdown ──
  drawText(page, MARGIN, y, 'RINGKASAN KATEGORI / CATEGORY SUMMARY', helvBold, 9, COLOR.accent)
  y -= 15

  if (summary.categories.length === 0) {
    drawText(page, MARGIN, y, 'Belum ada data pengeluaran.', helv, 9, COLOR.muted)
    y -= ROW_H
  }

  for (const entry of summary.categories.slice(0, 12)) {
    if (y < BOTTOM_LIMIT + 40) {
      drawFooter(ctx, page, ctx.pageIndex)
      page = newPage(ctx, false)
        y = PAGE_H - 40
    }
    drawText(page, MARGIN, y, CATEGORY_LABELS[entry.category].en, helv, 9)
    drawText(page, MARGIN + 210, y, `${entry.count}×`, helv, 8.5, COLOR.muted)
    drawText(page, MARGIN + 236, y, `${entry.percentage.toFixed(1)}%`, helv, 8.5, COLOR.muted)
    drawRight(page, PAGE_W - MARGIN, y, money(entry.amount, summary.currency), helv, 9)
    y -= ROW_H - 2
  }

  // ── Expense details table (flows across pages) ──
  y -= 14
  if (y < BOTTOM_LIMIT + 60) {
    drawFooter(ctx, page, ctx.pageIndex)
    page = newPage(ctx, false)
    y = PAGE_H - 40
  }

  drawText(page, MARGIN, y, 'RINCIAN PENGELUARAN / EXPENSE DETAILS', helvBold, 9, COLOR.accent)
  y -= 16
  drawTableHeader(ctx, page, y)
  y -= HEADER_H

  if (report.expenses.length === 0) {
    drawText(page, MARGIN, y, 'Tidak ada struk dalam laporan ini.', helv, 9, COLOR.muted)
    y -= ROW_H
  }

  for (const row of report.expenses) {
    if (y < BOTTOM_LIMIT) {
      drawFooter(ctx, page, ctx.pageIndex)
      page = newPage(ctx, false)
        y = PAGE_H - 40
      drawTableHeader(ctx, page, y)
      y -= HEADER_H
    }

    drawText(page, COL_DATE, y, truncate(row.transactionDate, 10), helv, 8.5)
    drawText(page, COL_MERCHANT, y, truncate(row.merchantName, 30), helv, 8.5)
    drawRight(page, COL_CATEGORY_RIGHT, y, truncate(categoryLabel(row.category), 20), helv, 8.5, COLOR.muted)
    drawRight(page, COL_PAYMENT_RIGHT, y, truncate(row.paymentMethod, 16), helv, 8.5, COLOR.muted)
    drawRight(page, COL_TOTAL_RIGHT, y, money(resolveExpenseTotal(row), summary.currency), helvBold, 9)
    y -= ROW_H
  }

  // ── Report total ──
  if (y < BOTTOM_LIMIT + 24) {
    drawFooter(ctx, page, ctx.pageIndex)
    page = newPage(ctx, false)
    y = PAGE_H - 60
  }
  y -= 4
  drawLine(page, MARGIN, y + 6, PAGE_W - MARGIN, y + 6, COLOR.line, 1)
  drawText(page, COL_MERCHANT, y - 8, 'TOTAL EXPENSES', helvBold, 10)
  drawRight(page, COL_TOTAL_RIGHT, y - 8, money(summary.totalExpenses, summary.currency), helvBold, 11, COLOR.accent)

  drawFooter(ctx, page, ctx.pageIndex)

  const bytes = await doc.save({ useObjectStreams: true })
  return Buffer.from(bytes)
}

function categoryLabel(value: string | null): string {
  const key = (value ?? '').trim()
  if (key in CATEGORY_LABELS) {
    return CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS].en
  }
  return key || '-'
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
