/**
 * Shared parsing preprocessors for AI-extracted JSON contracts.
 * Pure module (only depends on zod) — testable with `node --test`.
 * Used by both the receipt and invoice feature schemas.
 */

import { z } from 'zod'

/**
 * Parse currency-ish strings that may include thousands separators and the
 * Indonesian decimal comma, e.g. "Rp 12.500,00", "12,5", "500000", 12500.
 * Returns null when the value cannot be read — never guesses.
 */
export function parseAmount(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }
  if (typeof value !== 'string') return null

  let s = value.replace(/[^\d.,-]/g, '').trim()
  if (!s || !/\d/.test(s)) return null

  const hasComma = s.includes(',')
  const hasDot = s.includes('.')

  if (hasComma && hasDot) {
    s =
      s.lastIndexOf(',') > s.lastIndexOf('.')
        ? s.replace(/\./g, '').replace(',', '.')
        : s.replace(/,/g, '')
  } else if (hasComma && !hasDot) {
    s = s.replace(',', '.')
  } else {
    s = s.replace(/\./g, '')
  }

  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null

  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

/** Coerce "12.500,00" style values; unreadable ones become null. */
export const nullableAmount = z.preprocess(
  (val) => {
    if (val == null || val === '') return null
    return parseAmount(val)
  },
  z.number().nullable(),
)

const NULLISH = /^(null|undefined|none|n\/a|nan|-+)$/i

/** Coerce strings to trimmed non-empty; unreadable/missing ones become null. */
export const nullableString = z.preprocess(
  (val) => {
    if (val == null) return null
    if (typeof val !== 'string') return val
    const trimmed = val.trim()
    if (trimmed.length === 0 || NULLISH.test(trimmed)) return null
    return trimmed
  },
  z.string().min(1).nullable(),
)