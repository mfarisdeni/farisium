'use client'

import { CATEGORY_LABELS } from '@/features/expense/categories'
import type { ExpenseSummary } from '@/features/expense/summary'
import { GlassCard } from '@/components/ui/GlassCard'
import type { ExpenseContent } from './content'
import type { Lang } from '@/lib/translations'

interface ExpenseSummaryPanelProps {
  t: ExpenseContent
  lang: Lang
  summary: ExpenseSummary
  exporting: boolean
}

function formatAmount(value: number, currency: string | null): string {
  const formatted = value.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  return currency ? `${currency} ${formatted}` : formatted
}

export function ExpenseSummaryPanel({ t, lang, summary, exporting }: ExpenseSummaryPanelProps) {
  const stats: Array<[string, number]> = [
    [t.totalSubtotal, summary.totalSubtotal],
    [t.totalTax, summary.totalTax],
    [t.totalDiscount, summary.totalDiscount],
  ]

  return (
    <div className="space-y-4">
      <GlassCard className="p-5 sm:p-6">
        <p className="text-xs uppercase tracking-widest text-white/40">{t.totalExpenses}</p>
        <p
          className="mt-1 break-words text-3xl font-semibold text-white sm:text-4xl"
          aria-live="polite"
          aria-busy={exporting}
        >
          {formatAmount(summary.totalExpenses, summary.currency)}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <p className="text-xs text-white/40">{t.receiptCount}</p>
            <p className="text-lg text-white/85">{summary.receiptCount}</p>
          </div>
          {stats.map(([label, value]) => (
            <div key={label}>
              <p className="text-xs text-white/40">{label}</p>
              <p className="break-words text-lg text-white/85">{formatAmount(value, summary.currency)}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <p className="text-sm font-medium text-white/80">{t.categoriesTitle}</p>
        {summary.categories.length === 0 ? (
          <p className="mt-2 text-sm text-white/40">{t.noCategories}</p>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {summary.categories.map((entry) => {
              const label = CATEGORY_LABELS[entry.category][lang]
              return (
                <li key={entry.category}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate text-white/75">
                      {label}
                      <span className="ml-2 text-xs text-white/35">
                        {entry.count}×
                      </span>
                    </span>
                    <span className="shrink-0 tabular-nums text-white/85">
                      {formatAmount(entry.amount, summary.currency)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div
                      className="h-1 flex-1 overflow-hidden rounded-full bg-white/10"
                      role="presentation"
                    >
                      <div
                        className="h-full rounded-full bg-crimson/70"
                        style={{ width: `${Math.min(100, entry.percentage)}%` }}
                      />
                    </div>
                    <span className="w-12 shrink-0 text-right text-xs tabular-nums text-white/40">
                      {entry.percentage.toFixed(1)}%
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </GlassCard>
    </div>
  )
}
