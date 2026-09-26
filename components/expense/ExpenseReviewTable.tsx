'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/GlassCard'
import { CATEGORY_LABELS, EXPENSE_CATEGORIES, type ExpenseCategory } from '@/features/expense/categories'
import type { ExpenseRow } from '@/features/expense/schema'
import type { Lang } from '@/lib/translations'
import type { ExpenseContent } from './content'
import { AlertTriangle, Copy, Plus, Trash2, X } from 'lucide-react'

interface ExpenseReviewTableProps {
  t: ExpenseContent
  lang: Lang
  rows: ExpenseRow[]
  reviewIds: Set<string>
  duplicateIds: Set<string>
  onChange: (id: string, patch: Partial<ExpenseRow>) => void
  onDelete: (id: string) => void
  onAddManual: () => void
}

const NUMERIC_FIELDS = ['subtotal', 'tax', 'discount', 'grandTotal'] as const

const NUMERIC_LABELS: Record<(typeof NUMERIC_FIELDS)[number], (t: ExpenseContent) => string> = {
  subtotal: (t) => t.colSubtotal,
  tax: (t) => t.colTax,
  discount: (t) => t.colDiscount,
  grandTotal: (t) => t.colTotal,
}

function formatAmount(value: number | null | undefined, currency: string | null): string {
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

export function ExpenseReviewTable({
  t,
  lang,
  rows,
  reviewIds,
  duplicateIds,
  onChange,
  onDelete,
  onAddManual,
}: ExpenseReviewTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <GlassCard className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-white/85">{t.reviewTitle}</p>
          <p className="text-xs text-white/45">{t.reviewSubtitle}</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onAddManual}>
          <Plus className="h-4 w-4" />
          {t.addManual}
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="p-6 text-center text-sm text-white/40">{t.emptyQueue}</p>
      ) : (
        <ul className="divide-y divide-white/5">
          {rows.map((row) => {
            const editing = editingId === row.id
            const flagged = reviewIds.has(row.id)
            const duplicated = duplicateIds.has(row.id)

            return (
              <li key={row.id} className="p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-white/85">
                      {row.merchantName || '—'}
                      {row.invoiceNumber ? (
                        <span className="ml-2 text-xs text-white/35">#{row.invoiceNumber}</span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 text-xs text-white/45">
                      {row.transactionDate || t.missing}
                      {row.paymentMethod ? ` · ${row.paymentMethod}` : ''}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm tabular-nums text-white/85">
                      {formatAmount(row.grandTotal ?? row.subtotal, row.currency)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingId(editing ? null : row.id)}
                      aria-label={t.editRow}
                      aria-expanded={editing}
                      className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
                    >
                      {editing ? <X className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(row.id)}
                      aria-label={t.deleteRow}
                      className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-rose-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {flagged || duplicated ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {flagged ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                        <AlertTriangle className="h-3 w-3" />
                        {t.reviewBadge}
                      </span>
                    ) : null}
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
                    <label className="text-xs text-white/50">
                      {t.colDate}
                      <input
                        type="date"
                        value={row.transactionDate ?? ''}
                        onChange={(event) =>
                          onChange(row.id, { transactionDate: event.target.value || null })
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-crimson/60"
                      />
                    </label>
                    <label className="text-xs text-white/50">
                      {t.colMerchant}
                      <input
                        type="text"
                        value={row.merchantName ?? ''}
                        onChange={(event) =>
                          onChange(row.id, { merchantName: event.target.value || null })
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-crimson/60"
                      />
                    </label>
                    <label className="text-xs text-white/50">
                      {t.colCategory}
                      {/* Native select: consistent with the rest of the app and
                          keyboard/screen-reader friendly on every platform. */}
                      <select
                        value={row.category ?? 'other'}
                        onChange={(event) =>
                          onChange(row.id, { category: event.target.value as ExpenseCategory })
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-crimson/60"
                      >
                        {EXPENSE_CATEGORIES.map((category) => (
                          <option key={category} value={category} className="bg-[#0d0d12]">
                            {CATEGORY_LABELS[category][lang]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs text-white/50">
                      {t.colPayment}
                      <input
                        type="text"
                        value={row.paymentMethod ?? ''}
                        onChange={(event) =>
                          onChange(row.id, { paymentMethod: event.target.value || null })
                        }
                        className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-crimson/60"
                      />
                    </label>
                    {NUMERIC_FIELDS.map((field) => (
                      <label key={field} className="text-xs text-white/50">
                        {NUMERIC_LABELS[field](t)}
                        <input
                          type="text"
                          inputMode="decimal"
                          value={row[field] == null ? '' : String(row[field])}
                          onChange={(event) =>
                            onChange(row.id, { [field]: parseAmountInput(event.target.value) })
                          }
                          className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm tabular-nums text-white outline-none focus:border-crimson/60"
                        />
                      </label>
                    ))}
                    <label className="text-xs text-white/50 sm:col-span-2 lg:col-span-3">
                      {t.colNotes}
                      <input
                        type="text"
                        value={row.notes ?? ''}
                        onChange={(event) => onChange(row.id, { notes: event.target.value || null })}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-crimson/60"
                      />
                    </label>
                    <p className="text-xs text-white/35 sm:col-span-2 lg:col-span-3">
                      {t.rowTotalHint}
                    </p>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}
    </GlassCard>
  )
}
