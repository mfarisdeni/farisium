'use client'

import type { FStreamBoostOrder } from '@/lib/fStreamBoost'
import { GlassCard } from '@/components/ui/GlassCard'

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  pending: {
    label: 'Pending Review',
    bg: 'bg-frsc-surface-600/50',
    text: 'text-frsc-text-200',
    dot: 'bg-frsc-text-300/50',
  },
  reviewing: {
    label: 'Reviewing',
    bg: 'bg-frsc-purple-800/30',
    text: 'text-frsc-purple-300',
    dot: 'bg-frsc-purple-400',
  },
  waiting_payment: {
    label: 'Waiting Payment',
    bg: 'bg-yellow-500/15',
    text: 'text-yellow-400',
    dot: 'bg-yellow-400',
  },
  processing: {
    label: 'Processing Campaign',
    bg: 'bg-frsc-crimson-800/30',
    text: 'text-frsc-crimson-300',
    dot: 'bg-frsc-crimson-400',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-green-500/15',
    text: 'text-green-400',
    dot: 'bg-green-400',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    dot: 'bg-red-400',
  },
}

export function FStreamBoostOrderCard({
  order,
}: {
  order: FStreamBoostOrder
}) {
  const status = statusConfig[order.status] ?? statusConfig.pending

  return (
    <GlassCard
      variant="default"
      blur="light"
      withReflection
      withAccent="purple"
      className="p-4"
    >
      <div className="relative z-[2] space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-frsc-white-bright">
              {order.packageName}
            </h3>
            <p className="mt-0.5 truncate text-xs text-frsc-text-200">
              {order.artistName} &middot; {order.genre}
            </p>
          </div>

          {/* Status badge */}
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${status.bg} ${status.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        {/* Campaign target */}
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[10px] text-frsc-text-300/60">Streams</p>
              <p className="text-xs font-semibold text-frsc-crimson-400">
                1,000+
              </p>
            </div>
            <div>
              <p className="text-[10px] text-frsc-text-300/60">Listeners</p>
              <p className="text-xs font-semibold text-frsc-purple-400">
                300+
              </p>
            </div>
            <div>
              <p className="text-[10px] text-frsc-text-300/60">Duration</p>
              <p className="text-xs font-semibold text-frsc-text-100">
                7-10 days
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1.5 text-xs text-frsc-text-300/60">
          <div className="flex justify-between">
            <span>Payment</span>
            <span className="text-frsc-text-200">
              {order.paymentMethod === 'FRSC'
                ? '600 FRSC'
                : 'Rp299.000'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Track</span>
            <a
              href={order.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-[180px] truncate text-frsc-crimson-400 hover:text-frsc-crimson-300"
            >
              {order.spotifyUrl.replace(/^https?:\/\//, '')}
            </a>
          </div>
          <div className="flex justify-between">
            <span>Created</span>
            <span className="text-frsc-text-200">
              {order.createdAt.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          {order.adminNote && (
            <div className="mt-1 rounded-lg border border-frsc-crimson-500/10 bg-frsc-crimson-900/10 px-2.5 py-1.5 text-[11px] text-frsc-text-200">
              <span className="font-medium text-frsc-crimson-400">Note:</span>{' '}
              {order.adminNote}
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  )
}
