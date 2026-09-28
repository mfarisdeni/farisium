/**
 * Merge several extracted catalog pages into the single reviewed document.
 *
 * A marketplace catalogue is usually spread over several screenshots, and every
 * page is extracted independently (one job per file) so a single unreadable
 * page never discards the rest. This module is where those results become one
 * table: order is preserved (file order, then reading order inside the file),
 * shop headers are de-duplicated in first-seen order, and the row ids are
 * derived from those two coordinates so they stay stable across re-renders.
 *
 * Pure module — no React, no server imports — testable with `node --test`.
 */

import {
  MAX_CATALOG_PRODUCTS,
  toCatalogRow,
  type CatalogReport,
  type CatalogRow,
  type ProductCatalog,
} from './schema.ts'

export interface MergeCatalogInput {
  catalogName: string
  /** Per-file extraction results, in the order the user added the files. */
  catalogs: ProductCatalog[]
  /** File names of the pages that failed, shown on the review screen. */
  failedFiles?: string[]
  /** Currency chosen by the user; only used when no page reported one. */
  currency?: string | null
}

/** Deterministic row id: `d<document>p<product>` — stable for review + export. */
export function catalogRowId(documentIndex: number, productIndex: number): string {
  return `d${documentIndex}p${productIndex}`
}

export function mergeCatalogs(input: MergeCatalogInput): CatalogReport {
  const shops: string[] = []
  const seenShop = new Set<string>()
  const products: CatalogRow[] = []
  let source: string | null = null
  let currency: string | null = input.currency ?? null

  function addShop(value: string | null | undefined): void {
    const trimmed = value?.trim()
    if (!trimmed) return
    const key = trimmed.toLowerCase()
    if (seenShop.has(key)) return
    seenShop.add(key)
    shops.push(trimmed)
  }

  input.catalogs.forEach((catalog, documentIndex) => {
    source = source ?? catalog.source ?? null
    currency = currency ?? catalog.currency ?? null

    for (const shop of catalog.shops) {
      addShop(shop)
    }

    for (const [productIndex, product] of catalog.products.entries()) {
      if (products.length >= MAX_CATALOG_PRODUCTS) return
      products.push(toCatalogRow(product, catalogRowId(documentIndex, productIndex)))
    }
  })

  // A page does not have to report its shop headers in the top-level `shops`
  // array — the model sometimes only fills the per-product `store`. The review
  // screen uses this list to offer store suggestions, so the values the rows
  // actually carry must end up in it too, otherwise the picker is empty for a
  // page that clearly has shops.
  for (const product of products) {
    addShop(product.store)
  }

  return {
    catalogName: input.catalogName,
    source,
    currency,
    shops,
    products,
    failedFiles: input.failedFiles ?? [],
  }
}
