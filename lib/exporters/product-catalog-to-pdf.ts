/**
 * Plain, small PDF export for a reviewed product catalog (pdf-lib).
 *
 * Helvetica only (built-in, zero font embedding) and shared design tokens from
 * `pdf-kit`, so the document stays tiny and consistent with the invoice and
 * expense PDFs. Long product lists flow onto new pages automatically, repeating
 * the header row and the page footer.
 */

import { PDFDocument, StandardFonts, type PDFPage, type PDFFont } from 'pdf-lib'
import { buildCatalogSummary } from '@/features/product-catalog/summary'
import { findCatalogIssues } from '@/features/product-catalog/validation'
import type { CatalogReport } from '@/features/product-catalog/schema'
import {
  COLOR,
  MARGIN,
  PAGE_H,
  PAGE_W,
  drawLine,
  drawRight,
  drawText,
  money,
  truncateToWidth,
} from './pdf-kit'

const ROW_H = 16
const HEADER_H = 18
const BOTTOM_LIMIT = 72
const MAX_STORES = 12
const MAX_FAILED_FILES = 8
// pdf-kit exposes ink/muted/accent/line; the failed-file block reuses accent so
// it reads as a warning without adding a colour to the shared token set.

// Column right edges: amounts never share an axis with text, so long numbers
// cannot collide with the store column.
const COL_NO = MARGIN
const COL_NAME = MARGIN + 26
const COL_STORE = MARGIN + 200
const COL_ORIGINAL_RIGHT = PAGE_W - MARGIN - 68
const COL_PRICE_RIGHT = PAGE_W - MARGIN

// Printable widths per text column, each with an 8pt gutter against whatever
// sits to its right. The store column stops 64pt before the struck-through
// price's right edge, which is the widest that amount can grow.
const COL_NAME_WIDTH = COL_STORE - COL_NAME - 8
const COL_STORE_WIDTH = COL_ORIGINAL_RIGHT - 64 - COL_STORE - 8
const COL_SUMMARY_WIDTH = 202
const COL_META_VALUE_WIDTH = 320
// Full printable width minus a right gutter, for single-column lines.
const COL_FULL_WIDTH = PAGE_W - MARGIN * 2 - 8

interface Ctx {
  doc: PDFDocument
  helv: PDFFont
  helvBold: PDFFont
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
  drawText(page, COL_NO, y, '#', helvBold, 8, COLOR.muted)
  drawText(page, COL_NAME, y, 'PRODUK / PRODUCT', helvBold, 8, COLOR.muted)
  drawText(page, COL_STORE, y, 'TOKO / STORE', helvBold, 8, COLOR.muted)
  drawRight(page, COL_ORIGINAL_RIGHT, y, 'HARGA AWAL', helvBold, 8, COLOR.muted)
  drawRight(page, COL_PRICE_RIGHT, y, 'HARGA', helvBold, 8, COLOR.muted)
  drawLine(page, MARGIN, y - 7, PAGE_W - MARGIN, y - 7, COLOR.line, 1)
}

export async function buildCatalogPdf(report: CatalogReport): Promise<Buffer> {
  const summary = buildCatalogSummary(report)
  const doc = await PDFDocument.create()
  const helv = await doc.embedFont(StandardFonts.Helvetica)
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold)

  const ctx: Ctx = { doc, helv, helvBold, pageIndex: 0 }

  // ── Page 1: cover block + figures + store breakdown + first table rows ──
  let page = newPage(ctx, true)
  let y = PAGE_H - 44

  drawText(page, MARGIN, y, 'FARISIUM', helvBold, 10, COLOR.accent)
  drawRight(page, PAGE_W - MARGIN, y, 'PRODUCT CATALOG', helvBold, 20)
  y -= 14
  drawLine(page, MARGIN, y, PAGE_W - MARGIN, y, COLOR.line, 1)
  y -= 18

  const meta: Array<[string, string]> = [
    ['Nama Katalog / Catalog Name', truncateToWidth(report.catalogName, helv, 9, COL_META_VALUE_WIDTH)],
    ['Sumber / Source', truncateToWidth(report.source ?? '-', helv, 9, COL_META_VALUE_WIDTH)],
    ['Tanggal Cetak / Generated', new Date().toISOString().slice(0, 10)],
    ['Mata Uang / Currency', summary.currency ?? '-'],
  ]
  meta.forEach(([label, value]) => {
    drawText(page, MARGIN, y, label, helvBold, 8.5, COLOR.muted)
    drawRight(page, PAGE_W - MARGIN, y, value, helv, 9)
    y -= 14
  })

  y -= 10
  // Headline figures: total listed value + product count. A catalog page has no
  // invoice total, so the label says exactly what the number is.
  drawText(page, MARGIN, y, 'TOTAL HARGA DAFTAR', helvBold, 8.5, COLOR.muted)
  drawRight(page, PAGE_W - MARGIN, y - 4, money(summary.totalValue, summary.currency), helvBold, 18, COLOR.accent)
  drawRight(page, PAGE_W - MARGIN, y + 8, `${summary.productCount} produk / products`, helv, 8, COLOR.muted)
  y -= 26

  // ── Figures strip ──
  const strip: Array<[string, string]> = [
    ['Termurah / Lowest', money(summary.minPrice, summary.currency)],
    ['Tertinggi / Highest', money(summary.maxPrice, summary.currency)],
    ['Rata-rata / Average', money(summary.averagePrice, summary.currency)],
    ['Diskon / Discounted', `${summary.discountedCount} produk`],
  ]
  strip.forEach(([label, value]) => {
    drawText(page, MARGIN, y, label, helv, 9)
    drawRight(page, PAGE_W - MARGIN, y, value, helv, 9)
    y -= 13
  })
  y -= 8

  // ── Store breakdown ──
  drawText(page, MARGIN, y, 'RINGKASAN TOKO / STORE SUMMARY', helvBold, 9, COLOR.accent)
  y -= 15

  if (summary.stores.length === 0) {
    drawText(page, MARGIN, y, 'Belum ada data toko.', helv, 9, COLOR.muted)
    y -= ROW_H
  }

  for (const entry of summary.stores.slice(0, MAX_STORES)) {
    if (y < BOTTOM_LIMIT + 40) {
      drawFooter(ctx, page, ctx.pageIndex)
      page = newPage(ctx, false)
      y = PAGE_H - 40
    }
    drawText(
      page,
      MARGIN,
      y,
      truncateToWidth(entry.name ?? '(toko tidak tercetak)', helv, 9, COL_SUMMARY_WIDTH),
      helv,
      9,
    )
    drawText(page, MARGIN + 210, y, `${entry.productCount}x`, helv, 8.5, COLOR.muted)
    drawText(page, MARGIN + 236, y, `${entry.percentage.toFixed(1)}%`, helv, 8.5, COLOR.muted)
    drawRight(page, PAGE_W - MARGIN, y, money(entry.totalValue, summary.currency), helv, 9)
    y -= ROW_H - 2
  }

  if (summary.stores.length > MAX_STORES) {
    drawText(
      page,
      MARGIN,
      y,
      `+${summary.stores.length - MAX_STORES} toko lain / more stores`,
      helv,
      8.5,
      COLOR.muted,
    )
    y -= ROW_H - 2
  }

  // Partial coverage must be visible in the document itself: an exported PDF
  // that silently omits a page the user uploaded would read as complete.
  if (report.failedFiles.length > 0) {
    if (y < BOTTOM_LIMIT + 56) {
      drawFooter(ctx, page, ctx.pageIndex)
      page = newPage(ctx, false)
      y = PAGE_H - 40
    }
    drawText(page, MARGIN, y, 'GAMBAR GAGAL DIBACA / IMAGES THAT FAILED', helvBold, 8.5, COLOR.accent)
    y -= 13
    for (const file of report.failedFiles.slice(0, MAX_FAILED_FILES)) {
      drawText(
        page,
        MARGIN,
        y,
        truncateToWidth(`\u2022 ${file}`, helv, 8.5, COL_FULL_WIDTH),
        helv,
        8.5,
        COLOR.muted,
      )
      y -= 11
    }
    if (report.failedFiles.length > MAX_FAILED_FILES) {
      drawText(
        page,
        MARGIN,
        y,
        `+${report.failedFiles.length - MAX_FAILED_FILES} lainnya / more`,
        helv,
        8.5,
        COLOR.muted,
      )
      y -= 11
    }
  }

  // ── Product table (flows across pages) ──
  y -= 14
  if (y < BOTTOM_LIMIT + 60) {
    drawFooter(ctx, page, ctx.pageIndex)
    page = newPage(ctx, false)
    y = PAGE_H - 40
  }

  drawText(page, MARGIN, y, 'DAFTAR PRODUK / PRODUCT LIST', helvBold, 9, COLOR.accent)
  drawRight(page, PAGE_W - MARGIN, y, '* perlu diperiksa / needs review', helv, 8, COLOR.muted)
  y -= 16
  drawTableHeader(ctx, page, y)
  y -= HEADER_H

  report.products.forEach((row, index) => {
    if (y < BOTTOM_LIMIT) {
      drawFooter(ctx, page, ctx.pageIndex)
      page = newPage(ctx, false)
      y = PAGE_H - 40
      drawTableHeader(ctx, page, y)
      y -= HEADER_H
    }

    // Two lines per product: the name, then the printed specification. A single
    // line would truncate the variant away on every long marketplace title, so
    // the PDF would silently drop a column the reviewer had already curated.
    const detail = [row.variant, row.brand].filter(Boolean).join(' · ')
    const lineCount = detail ? 2 : 1

    // Rows the reviewer did not clear keep their marker in the exported
    // document: the flag travels with the file instead of staying in the app.
    const flagged = findCatalogIssues(row).length > 0
    drawText(page, COL_NO, y, flagged ? `${index + 1}*` : String(index + 1), helv, 8.5, COLOR.muted)
    drawText(page, COL_NAME, y, truncateToWidth(row.name, helv, 8.5, COL_NAME_WIDTH), helv, 8.5)
    drawText(page, COL_STORE, y, truncateToWidth(row.store, helv, 8.5, COL_STORE_WIDTH), helv, 8.5, COLOR.muted)
    if (row.originalPrice != null) {
      drawRight(page, COL_ORIGINAL_RIGHT, y, money(row.originalPrice, null), helv, 8.5, COLOR.muted)
    }
    drawRight(page, COL_PRICE_RIGHT, y, money(row.price, null), helvBold, 9)

    if (detail) {
      drawText(
        page,
        COL_NAME,
        y - 9,
        truncateToWidth(detail, helv, 7.5, COL_NAME_WIDTH),
        helv,
        7.5,
        COLOR.muted,
      )
    }

    y -= lineCount === 2 ? ROW_H * 2 - 6 : ROW_H
  })

  // ── Catalog total ──
  if (y < BOTTOM_LIMIT + 24) {
    drawFooter(ctx, page, ctx.pageIndex)
    page = newPage(ctx, false)
    y = PAGE_H - 60
  }
  y -= 4
  drawLine(page, MARGIN, y + 6, PAGE_W - MARGIN, y + 6, COLOR.line, 1)
  drawText(page, COL_NAME, y - 8, 'TOTAL HARGA DAFTAR', helvBold, 10)
  drawRight(page, COL_PRICE_RIGHT, y - 8, money(summary.totalValue, summary.currency), helvBold, 11, COLOR.accent)

  drawFooter(ctx, page, ctx.pageIndex)

  const bytes = await doc.save({ useObjectStreams: true })
  return Buffer.from(bytes)
}
