'use client'

import { adsConfig, type AdSlotKey } from '@/lib/adsConfig'

interface AdSlotProps {
  slot: AdSlotKey
  width: number
  height: number
  className?: string
}

const minHeights: Record<number, string> = {
  90: 'min-h-[90px]',
  250: 'min-h-[250px]',
  280: 'min-h-[280px]',
  600: 'min-h-[600px]',
}

export function AdSlot({ slot, width, height, className = '' }: AdSlotProps) {
  const html = adsConfig[slot]
  if (!html) return null

  const cls = `overflow-hidden rounded-xl bg-frsc-surface-800/50 ${minHeights[height] ?? `min-h-[${height}px]`} ${className}`

  return (
    <div
      className={cls}
      style={{ width, height, minHeight: height, maxWidth: '100%' }}
      aria-label="Advertisement"
      // biome-ignore lint/security/noDangerouslySetInnerHtml
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
