'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/GlassCard'
import type { CatalogRow } from '@/features/product-catalog/schema'
import type { CatalogIssueCode } from '@/features/product-catalog/validation'
import type { CatalogContent } from './content'
import { AlertTriangle, Copy, Pencil, Plus, Trash2, X } from 'lucide-react'

interface CatalogReviewTableProps {
  t: CatalogContent
  rows: CatalogRow[]
  issues: Map<string, CatalogIssueCode[]>
  duplicateIds: Set<string>
  shops: string[]
  onChange: (id: string, patch: Partial<CatalogRow>) => void
  onDelete: (id: string) => void
  onAddManual: () => void
}

const ISSUE_LABELS: Record<CatalogIssueCode, (t: CatalogContent) => string> = {
  name: (t) => t.issueName,
  price: (t) => t.issuePrice,
  priceAboveOriginal: (t) => t.issuePriceAboveOriginal,
  ratingRange: (t) => t.issueRatingRange,
  discountRange: (t) => t.issueDiscountRange,
  storeIsMarketplace: (t) => t.issueStoreIsMarketplace,
}

const NUMERIC_FIELDS = ['price', 'originalPrice', 'discountPercent', 'rating'] as const

const NUMERIC_LABELS: Record<(typeof NUMERIC_FIELDS)[number], (t: CatalogContent) => string> = {
  price: (t) => t.colPrice,
  originalPrice: (t) => t.colOriginalPrice,
  discountPercent: (t) => t.colDiscount,
  rating: (t) => t.colRating,
}

const TEXT_FIELDS = ['name', 'variant', 'brand', 'category', 'sku', 'soldCount'] as const

const TEXT_LABELS: Record<(typeof TEXT_FIELDS)[number], (t: CatalogContent) => string> = {
  name: (t) => t.colName,
  variant: (t) => t.colVariant,
  brand: (t) => t.colBrand,
  category: (t) => t.colCategory,
  sku: (t) => t.colSku,
  soldCount: (t) => t.colSold,
}

function formatAmount(value: number | null, currency: string | null): string {
  if (value == null) return '-'
  const formatted = value.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  return currency ? `${currency} ${formatted}` : formatted
}

/** Empty input → null (unknown), never 0, so "unread" is not "free". */
function parseAmountInput(raw: string): number | null {
  const cleaned = raw.replace(/[^\d.,-]/g, '').trim()
  if (!cleaned) return null

  // Accept both "1.500,00" (id-ID) and "1,500.00" (en-US) input styles.
  const lastComma = cleaned.lastIndexOf(',')
  const lastDot = cleaned.lastIndexOf('.')
  let normalized = cleaned
  if (lastComma > lastDot) {
    normalized = cleaned.replace(/\./g, '').replace(',', '.')
  } else if (lastDot > lastComma) {
    normalized = cleaned.replace(/,/g, '')
  } else {
    normalized = cleaned.replace(/[.,]/g, '')
  }

  const value = Number(normalized)
  return Number.isFinite(value) ? value : null
}

export function CatalogReviewTable({
  t,
  rows,
  issues,
  duplicateIds,
  shops,
  onChange,
  onDelete,
  onAddManual,
}: CatalogReviewTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <GlassCard className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-frsc-text-100">{t.reviewTitle}</p>
          <p className="text-xs text-frsc-text-300">{t.reviewSubtitle}</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onAddManual}>
          <Plus className="h-4 w-4" />
          {t.addManual}
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="p-6 text-center text-sm text-frsc-text-300">{t.emptyQueue}</p>
      ) : (
        <ul className="divide-y divide-white/5">
          {rows.map((row, index) => {
            const editing = editingId === row.id
            const rowIssues = issues.get(row.id) ?? []
            const duplicated = duplicateIds.has(row.id)

            return (
              <li key={row.id} className="p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-frsc-text-100">
                      <span className="mr-1.5 text-xs tabular-nums text-frsc-text-300">
                        {index + 1}.
                      </span>
                      {row.name || t.missing}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-frsc-text-300">
                      {row.variant ? `${row.variant} · ` : ''}
                      {row.store || t.noStoreLabel}
                      {row.sourceFile ? ` · ${row.sourceFile}` : ''}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm tabular-nums text-frsc-text-100">
                      {formatAmount(row.price, null)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingId(editing ? null : row.id)}
                      aria-label={t.editRow}
                      aria-expanded={editing}
                      className="rounded-lg p-1.5 text-frsc-text-300 transition-colors hover:bg-input hover:text-frsc-text-200"
                    >
                      {editing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(row.id)}
                      aria-label={t.deleteRow}
                      className="rounded-lg p-1.5 text-frsc-text-300 transition-colors hover:bg-input hover:text-rose-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {rowIssues.length > 0 || duplicated ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {rowIssues.map((code) => (
                      <span
                        key={code}
                        className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400"
                      >
                        <AlertTriangle className="h-3 w-3" />
                        {ISSUE_LABELS[code](t)}
                      </span>
                    ))}
                    {duplicated ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                        <Copy className="h-3 w-3" />
                        {t.duplicateBadge}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                {editing ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {TEXT_FIELDS.map((field) => (
                      <label key={field} className="text-xs text-frsc-text-300">
                        {TEXT_LABELS[field](t)}
                        <input
                          type="text"
                          value={row[field] ?? ''}
                          onChange={(event) =>
                            onChange(row.id, { [field]: event.target.value || null })
                          }
                          className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-frsc-text-100 outline-none focus:border-frsc-crimson-500/60"
                        />
                      </label>
                    ))}
                    <label className="text-xs text-frsc-text-300">
                      {t.colStore}
                      <input
                        type="text"
                        list="catalog-shops"
                        value={row.store ?? ''}
                        onChange={(event) =>
                          onChange(row.id, { store: event.target.value || null })
                        }
                        className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-frsc-text-100 outline-none focus:border-frsc-crimson-500/60"
                      />
                    </label>
                    {NUMERIC_FIELDS.map((field) => (
                      <label key={field} className="text-xs text-frsc-text-300">
                        {NUMERIC_LABELS[field](t)}
                        <input
                          type="text"
                          inputMode="decimal"
                          value={row[field] == null ? '' : String(row[field])}
                          onChange={(event) =>
                            onChange(row.id, { [field]: parseAmountInput(event.target.value) })
                          }
                          className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm tabular-nums text-frsc-text-100 outline-none focus:border-frsc-crimson-500/60"
                        />
                      </label>
                    ))}
                    <label className="text-xs text-frsc-text-300 sm:col-span-2 lg:col-span-3">
                      {t.colNotes}
                      <input
                        type="text"
                        value={row.notes ?? ''}
                        onChange={(event) => onChange(row.id, { notes: event.target.value || null })}
                        className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-frsc-text-100 outline-none focus:border-frsc-crimson-500/60"
                      />
                    </label>
                    <p className="text-xs text-frsc-text-300 sm:col-span-2 lg:col-span-3">
                      {t.storeHint}
                    </p>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}

      {/* Suggested shop names, so a mis-attributed store is one tap to fix. */}
      {shops.length > 0 ? (
        <div className="border-t border-border p-4 sm:p-5">
          <p className="text-xs text-frsc-text-300">{t.shopSelectLabel}</p>
          <datalist id="catalog-shops">
            {shops.map((shop) => (
              <option key={shop} value={shop} />
            ))}
          </datalist>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {shops.map((shop) => (
              <li
                key={shop}
                className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-frsc-text-200"
              >
                {shop}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </GlassCard>
  )
}
