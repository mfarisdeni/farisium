'use client'

import { useEffect, useRef, useState } from 'react'
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

const ADS_CLIENT = 'ca-pub-6861723745616674'

/** Load the adsbygoogle tag only when an ad uses the <ins> embed format. */
function loadAdsScript(): void {
  if (typeof window === 'undefined') return
  if (document.querySelector('script[data-farisium-ads]')) return
  const w = window as unknown as { adsbygoogle?: unknown }
  if (typeof w.adsbygoogle !== 'undefined') return

  const s = document.createElement('script')
  s.async = true
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`
  s.setAttribute('data-farisium-ads', '')
  s.crossOrigin = 'anonymous'
  document.head.appendChild(s)
}

export function AdSlot({ slot, width, height, className = '' }: AdSlotProps) {
  const html: string = adsConfig[slot]
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  // Only mount the slot when it approaches the viewport — this keeps
  // third-party ad iframes / scripts out of the initial render path.
  useEffect(() => {
    const el = ref.current
    if (!el || !html) return

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true)
          if (html.includes('<ins') || /adsbygoogle/i.test(html)) {
            loadAdsScript()
          }
          io.disconnect()
        }
      },
      { rootMargin: '400px 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [html])

  if (!html) return null

  const cls = `overflow-hidden rounded-xl bg-frsc-surface-800/50 ${minHeights[height] ?? `min-h-[${height}px]`} ${className}`

  return (
    <div
      ref={ref}
      className={cls}
      style={{ width, height, minHeight: height, maxWidth: '100%' }}
      aria-label="Advertisement"
    >
      {visible && (
        <div
          // biome-ignore lint/security/noDangerouslySetInnerHtml
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  )
}