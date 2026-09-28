/**
 * Shared PDF design tokens + drawing primitives (pdf-lib, Helvetica only).
 *
 * Extracted from the invoice exporter so every Farisium PDF (invoice, expense
 * report) shares one set of page metrics, colors, number formatting, and
 * text helpers — no font embedding, no design drift between documents.
 */

import { rgb, type PDFFont, type PDFPage } from 'pdf-lib'

export const PAGE_W = 595.28
export const PAGE_H = 841.89
export const MARGIN = 56

export const COLOR = {
  ink: rgb(0.106, 0.141, 0.188), // #1B2430
  muted: rgb(0.36, 0.39, 0.45), // #5B6270
  accent: rgb(0.878, 0.188, 0.306), // #E0304E
  line: rgb(0.89, 0.91, 0.92), // #E3E5E9
}

/** Indonesian number grouping, 0–2 decimals, shared by every exporter. */
export function fmt(value: number | null): string {
  if (value == null) return '-'
  return value.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

export function money(value: number | null, currency: string | null): string {
  if (value == null) return '-'
  return currency ? `${currency} ${fmt(value)}` : fmt(value)
}

export function truncate(text: string | null | undefined, max = 36): string {
  if (!text || text.trim().length === 0) return '-'
  const trimmed = text.trim()
  return trimmed.length > max ? `${trimmed.slice(0, max - 1).trim()}…` : trimmed
}

/**
 * Helvetica is a WinAnsi-encoded, built-in font — it physically cannot encode
 * characters such as `→` (U+2192) or `—` (U+2014), and pdf-lib throws when it
 * tries. Every exporter that prints user-derived or decorated text must run it
 * through this, so typography degrades to ASCII instead of failing the export.
 */
export function pdfSafe(text: string): string {
  return text
    .replace(/[\u2013\u2014\u2212]/g, '-') // en/em dash, minus sign
    .replace(/\u2190|\u2192|\u2194/g, '->') // arrows
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/\u2026/g, '...') // ellipsis
    .replace(/\u00A0/g, ' ')
    .replace(/[^\x20-\x7E\xA1-\xFF]/g, '?') // anything else WinAnsi lacks
}

export function drawText(
  page: PDFPage,
  x: number,
  y: number,
  text: string,
  font: PDFFont,
  size: number,
  color: ReturnType<typeof rgb> = COLOR.ink,
): void {
  page.drawText(pdfSafe(text), { x, y, size, font, color })
}

export function drawLine(
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
 * Right-align a short value so amounts line up under the amount column and
 * long numbers can never collide with the label column.
 */
export function drawRight(
  page: PDFPage,
  rightX: number,
  y: number,
  text: string,
  font: PDFFont,
  size: number,
  color: ReturnType<typeof rgb> = COLOR.ink,
): void {
  const safe = pdfSafe(text)
  const width = font.widthOfTextAtSize(safe, size)
  page.drawText(safe, { x: rightX - width, y, size, font, color })
}

/** Width of a string at a given size — used for column fitting. */
export function textWidth(text: string, font: PDFFont, size: number): number {
  return font.widthOfTextAtSize(pdfSafe(text), size)
}

/**
 * Trim text to a *column width* rather than to a character count. A 34-char
 * Indonesian title is far narrower than 34 CJK characters at the same size, so
 * a fixed character limit either wastes half a column or spills into the
 * neighbouring one. This measures the exact string that will be drawn and
 * returns the longest prefix that still fits, with an ellipsis when it does
 * not. Binary search keeps it cheap even for long marketplace titles.
 */
export function truncateToWidth(
  text: string | null | undefined,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string {
  const safe = pdfSafe(text ?? '')
  if (safe.length === 0) return '-'
  if (textWidth(safe, font, size) <= maxWidth) return safe

  const ellipsis = '...'
  const ellipsisWidth = textWidth(ellipsis, font, size)
  let low = 0
  let high = safe.length
  while (low < high) {
    const mid = Math.ceil((low + high) / 2)
    if (textWidth(`${safe.slice(0, mid)} ${ellipsis}`, font, size) <= maxWidth) low = mid
    else high = mid - 1
  }
  if (low <= 0) return ellipsis
  return `${safe.slice(0, low).trimEnd()}${ellipsis}`
}
