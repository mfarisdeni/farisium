/**
 * Lightweight duplicate detection for a reviewed catalog.
 *
 * Purely advisory: a possible duplicate is flagged, never removed. Marketplace
 * search results legitimately repeat the same product across pages or shops,
 * so the user — not the tool — decides which rows stay. A pair only matches
 * when the normalised name AND the live price line up, which keeps the signal
 * high: two different products in the same grid almost never share both.
 *
 * Pure module — no React, no server imports — testable with `node --test`.
 */

import type { CatalogRow } from './schema.ts'

const RELATIVE_TOLERANCE = 0.005
const ABSOLUTE_TOLERANCE = 1
/** Below this many characters a title carries too little signal to accuse. */
const MIN_NAME_LENGTH = 4

export interface DuplicateGroup {
  key: string
  ids: string[]
  name: string
  price: number
}

/**
 * Lowercase, drop everything that is not a letter or digit, collapse the rest.
 * Truncated marketplace titles ("LAMPU LED NEON...") therefore compare equal to
 * the same title printed in full, which is exactly the pair worth flagging.
 */
export function normalizeProductName(value: string | null | undefined): string {
  if (!value) return ''
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function pricesMatch(a: number, b: number): boolean {
  const diff = Math.abs(a - b)
  if (diff <= ABSOLUTE_TOLERANCE) return true
  const largest = Math.max(Math.abs(a), Math.abs(b), 1)
  return diff / largest <= RELATIVE_TOLERANCE
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function findPossibleDuplicates(rows: CatalogRow[]): DuplicateGroup[] {
  // Rows without a readable name or price are never grouped — there is nothing
  // to compare, and guessing would only add noise to the review screen.
  const byName = new Map<string, CatalogRow[]>()
  for (const row of rows) {
    const name = normalizeProductName(row.name)
    if (name.length < MIN_NAME_LENGTH || row.price == null) continue
    const group = byName.get(name)
    if (group) group.push(row)
    else byName.set(name, [row])
  }

  const groups: DuplicateGroup[] = []
  for (const [name, candidates] of byName) {
    if (candidates.length < 2) continue

    const consumed = new Set<string>()
    for (const seed of candidates) {
      if (consumed.has(seed.id)) continue
      const cluster = [seed]

      for (const candidate of candidates) {
        if (candidate.id === seed.id || consumed.has(candidate.id)) continue
        if (!pricesMatch(candidate.price as number, seed.price as number)) continue
        cluster.push(candidate)
      }

      if (cluster.length < 2) continue
      for (const row of cluster) consumed.add(row.id)
      groups.push({
        key: `${name}|${round2(seed.price as number)}`,
        ids: cluster.map((row) => row.id),
        name: seed.name ?? name,
        price: round2(seed.price as number),
      })
    }
  }

  return groups
}

/** Flatten duplicate groups into the set of flagged row ids. */
export function duplicateRowIds(groups: DuplicateGroup[]): Set<string> {
  const ids = new Set<string>()
  for (const group of groups) {
    for (const id of group.ids) ids.add(id)
  }
  return ids
}
