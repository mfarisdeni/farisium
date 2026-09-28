/**
 * Zod schema + parser for the product catalog extraction contract.
 *
 * The source of truth for one product row in the reviewed table and in the
 * exported workbook. Designed for marketplace grids and supplier catalogs,
 * where a "row" is a card rather than a line on an invoice: every field is
 * nullable because a screenshot often shows only a name and a price.
 *
 * Pure module (only depends on zod) — testable with `node --test`.
 */

import { z } from 'zod'
import { nullableAmount, nullableString, parseJsonObject } from '../parsing.ts'

/** Maximum products kept from a single source document. */
export const MAX_PRODUCTS_PER_DOCUMENT = 400

/** Maximum pages (screenshots / photos) a single catalog run may hold. */
export const MAX_CATALOG_DOCUMENTS = 8

/** Maximum products in the merged, reviewed catalog. */
export const MAX_CATALOG_PRODUCTS = 600

const productSchema = z.object({
  /** Product title as printed, including a trailing ellipsis if truncated. */
  name: nullableString.default(null),
  /** Size/colour/pack distinction printed under the title, e.g. "2 Packs". */
  variant: nullableString.default(null),
  sku: nullableString.default(null),
  brand: nullableString.default(null),
  category: nullableString.default(null),
  /** Current selling price. Never a struck-through price. */
  price: nullableAmount.default(null),
  /** Pre-discount price when the source prints one. */
  originalPrice: nullableAmount.default(null),
  discountPercent: nullableAmount.default(null),
  /** Seller or storefront shown on the card. */
  store: nullableString.default(null),
  rating: nullableAmount.default(null),
  /** Sold count is free text ("10RB+ terjual", "8,8K") — not a number. */
  soldCount: nullableString.default(null),
  sourceFile: nullableString.default(null),
  /** 1-based page for PDFs; null for single images. */
  sourcePage: nullableAmount.default(null),
  notes: nullableString.default(null),
})

export type CatalogProduct = z.infer<typeof productSchema>

export const productCatalogSchema = z.object({
  /** Marketplace or document kind, e.g. "Shopee", "Tokopedia", "katalog.pdf". */
  source: nullableString.default(null),
  currency: nullableString.default(null),
  /**
   * Shop names visible on the page, in reading order.
   *
   * A marketplace grid often groups cards under a shop header, so a card's
   * store comes from the nearest header printed above it. Keeping the headers
   * as their own list makes that attribution auditable and gives the review
   * table a ready list to offer when a user reassigns a row.
   */
  shops: z.array(z.string()).default([]),
  products: z.array(productSchema).max(MAX_PRODUCTS_PER_DOCUMENT).default([]),
  needsReview: z.boolean().optional().default(false),
  warnings: z.array(z.string()).default([]),
})

export type ProductCatalog = z.infer<typeof productCatalogSchema>

/**
 * Parse the model's raw text output into a validated ProductCatalog.
 * Shares the defensive balanced-object extraction with the other features.
 */
export function parseProductCatalogJson(text: string): ProductCatalog {
  return parseJsonObject(text, productCatalogSchema)
}

/* ── Review contract ──────────────────────────────────────────────────────
 * The extraction contract above describes ONE page. The review screen and the
 * export endpoint work on a merged catalog of several pages whose rows the user
 * can edit, so they need the two contracts below. */

export const catalogProductSchema = productSchema
export type CatalogProductRow = z.infer<typeof catalogProductSchema>

/** A reviewed product row: an extracted product plus a stable client id. */
export const catalogRowSchema = productSchema.extend({
  id: z.string().min(1).max(64),
})

export type CatalogRow = z.infer<typeof catalogRowSchema>

/** The merged catalog document the client reviews and the exporters consume. */
export const catalogReportSchema = z.object({
  catalogName: z.string().min(1).max(120),
  source: nullableString.default(null),
  currency: nullableString.default(null),
  shops: z.array(z.string().min(1).max(120)).max(MAX_CATALOG_PRODUCTS).default([]),
  products: z.array(catalogRowSchema).max(MAX_CATALOG_PRODUCTS),
  /** Documents that failed to extract, kept for the review screen. */
  failedFiles: z.array(z.string().min(1).max(120)).max(MAX_CATALOG_DOCUMENTS).default([]),
})

export type CatalogReport = z.infer<typeof catalogReportSchema>

/** Build a review row from an extracted product (ids are assigned by the caller). */
export function toCatalogRow(product: CatalogProductRow, id: string): CatalogRow {
  return { ...product, id }
}
