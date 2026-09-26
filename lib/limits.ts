/**
 * Product policy: agent feature keys and per-user daily budgets.
 *
 * Pure module (no Firebase, no SDK) so it can be imported by server routes,
 * client components, and `node --test`. The job store in `lib/jobs/core.ts`
 * owns the *enforcement*; this module owns the *numbers*, so the limit shown
 * in the UI can never drift from the limit the server enforces.
 */

export const RECEIPT_FEATURE = 'receipt_to_excel'
export const INVOICE_FEATURE = 'invoice_from_image'
export const EXPENSE_FEATURE = 'expense_report'

/** Daily budget for the one-shot agents: Receipt to Excel and Image to Invoice. */
export const DAILY_CONVERSION_LIMIT = 10

export const KNOWN_FEATURES = [
  RECEIPT_FEATURE,
  INVOICE_FEATURE,
  EXPENSE_FEATURE,
] as const

export type Feature = (typeof KNOWN_FEATURES)[number]

/**
 * Per-feature daily budget, counted per authenticated user per day.
 * The expense report spends one slot per receipt (not per report), so it gets a
 * larger allowance than the one-shot agents.
 */
export const DAILY_LIMITS: Record<Feature, number> = {
  [RECEIPT_FEATURE]: DAILY_CONVERSION_LIMIT,
  [INVOICE_FEATURE]: DAILY_CONVERSION_LIMIT,
  [EXPENSE_FEATURE]: 20,
}

export function getDailyLimit(feature: Feature): number {
  return DAILY_LIMITS[feature] ?? DAILY_CONVERSION_LIMIT
}

export function isKnownFeature(value: string | undefined | null): value is Feature {
  return typeof value === 'string' && (KNOWN_FEATURES as readonly string[]).includes(value)
}
