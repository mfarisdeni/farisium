/**
 * Ad slot configuration.
 * Paste raw iframe embed HTML for each slot.
 * If a slot is empty (""), it will be hidden automatically.
 */
export const adsConfig = {
  /** Slot A — 300×250 (Medium Rectangle) */
  slotA: '',

  /** Slot B — 728×90 (Leaderboard) */
  slotB: '',

  /** Slot C — 336×280 (Large Rectangle) */
  slotC: '',
} as const

export type AdSlotKey = keyof typeof adsConfig
