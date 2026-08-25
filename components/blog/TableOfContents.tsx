'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ headings }: { headings: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('')

  const handleScroll = useCallback(() => {
    const visible: { id: string; top: number }[] = []

    for (const { id } of headings) {
      const el = document.getElementById(id)
      if (!el) continue
      const rect = el.getBoundingClientRect()
      if (rect.top <= 120) {
        visible.push({ id, top: rect.top })
      }
    }

    if (visible.length > 0) {
      visible.sort((a, b) => b.top - a.top)
      setActiveId(visible[0].id)
    }
  }, [headings])

  useEffect(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  if (headings.length < 2) return null

  return (
    <nav
      aria-label="Table of contents"
      className="mb-10 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-frsc-text-300">
        Daftar Isi
      </p>
      <ul className="space-y-1.5">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={cn(
                'block rounded-lg px-3 py-1.5 text-sm transition-all duration-200',
                level === 3 && 'ml-4',
                activeId === id
                  ? 'bg-frsc-crimson-800/20 text-frsc-crimson-300 font-medium'
                  : 'text-frsc-text-300 hover:text-frsc-white-bright hover:bg-white/[0.04]',
              )}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
