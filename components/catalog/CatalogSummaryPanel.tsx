'use client'

import { buildCatalogSummary, type CatalogSummary } from '@/features/product-catalog/summary'
import { GlassCard } from '@/components/ui/GlassCard'
import { FileImage } from 'lucide-react'
import type { CatalogContent } from './content'
import type { CatalogReport } from '@/features/product-catalog/schema'

interface CatalogSummaryPanelProps {
  t: CatalogContent
  report: CatalogReport
  exporting: boolean
}

function formatAmount(value: number | null, currency: string | null): string {
  if (value == null) return '-'
  const formatted = value.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  return currency ? `${currency} ${formatted}` : formatted
}

export function CatalogSummaryPanel({ t, report, exporting }: CatalogSummaryPanelProps) {
  const summary: CatalogSummary = buildCatalogSummary(report)
  const documents = [
    ...new Set(report.products.map((row) => row.sourceFile).filter((name): name is string => !!name)),
  ]

  return (
    <div className="space-y-4">
      <GlassCard className="p-5 sm:p-6">
        <p className="text-xs uppercase tracking-widest text-frsc-text-300">{t.totalListedValue}</p>
        <p
          className="mt-1 break-words text-3xl font-semibold text-frsc-text-100 sm:text-4xl"
          aria-live="polite"
          aria-busy={exporting}
        >
          {formatAmount(summary.totalValue, summary.currency)}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <p className="text-xs text-frsc-text-300">{t.productCount}</p>
            <p className="text-lg text-frsc-text-100">{summary.productCount}</p>
          </div>
          <div>
            <p className="text-xs text-frsc-text-300">{t.shopCount}</p>
            <p className="text-lg text-frsc-text-100">{summary.shopCount}</p>
          </div>
          <div>
            <p className="text-xs text-frsc-text-300">{t.discountedCount}</p>
            <p className="text-lg text-frsc-text-100">{summary.discountedCount}</p>
          </div>
          <div>
            <p className="text-xs text-frsc-text-300">{t.pricedCount}</p>
            <p className="text-lg text-frsc-text-100">{summary.pricedCount}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-frsc-text-300">{t.minPrice}</p>
            <p className="break-words text-sm tabular-nums text-frsc-text-100">
              {formatAmount(summary.minPrice, summary.currency)}
            </p>
          </div>
          <div>
            <p className="text-xs text-frsc-text-300">{t.maxPrice}</p>
            <p className="break-words text-sm tabular-nums text-frsc-text-100">
              {formatAmount(summary.maxPrice, summary.currency)}
            </p>
          </div>
          <div>
            <p className="text-xs text-frsc-text-300">{t.averagePrice}</p>
            <p className="break-words text-sm tabular-nums text-frsc-text-100">
              {formatAmount(summary.averagePrice, summary.currency)}
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <p className="text-sm font-medium text-frsc-text-100">{t.storesTitle}</p>
        {summary.stores.length === 0 ? (
          <p className="mt-2 text-sm text-frsc-text-300">{t.noStores}</p>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {summary.stores.map((entry) => (
              <li key={entry.name ?? '__no_store__'}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate text-frsc-text-100">
                    {entry.name ?? t.noStoreLabel}
                    <span className="ml-2 text-xs text-frsc-text-300">
                      {entry.productCount}x
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums text-frsc-text-100">
                    {formatAmount(entry.totalValue, summary.currency)}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-border" role="presentation">
                    <div
                      className="h-full rounded-full bg-frsc-crimson-500/70"
                      style={{ width: `${Math.min(100, entry.percentage)}%` }}
                    />
                  </div>
                  <span className="w-12 shrink-0 text-right text-xs tabular-nums text-frsc-text-300">
                    {entry.percentage.toFixed(1)}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>

      {documents.length > 0 ? (
        <GlassCard className="p-4">
          <p className="inline-flex items-center gap-2 text-xs text-frsc-text-300">
            <FileImage className="h-3.5 w-3.5" />
            {t.documentsTitle}
          </p>
          <ul className="mt-2 space-y-1">
            {documents.map((name) => (
              <li key={name} className="truncate text-xs text-frsc-text-200">
                {name}
              </li>
            ))}
          </ul>
        </GlassCard>
      ) : null}
    </div>
  )
}
