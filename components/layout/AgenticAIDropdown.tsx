'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ReceiptText, FileSpreadsheet, Headphones, FileText, Sparkles, ArrowRight } from 'lucide-react'
import { useLang } from '@/hooks/useLang'

interface AgenticAIDropdownItem {
  href: string
  icon: React.ComponentType<{ className?: string }>
  name: { id: string; en: string }
  desc: { id: string; en: string }
}

interface AgenticAIDropdownProps {
  items?: AgenticAIDropdownItem[]
}

const DEFAULT_ITEMS: AgenticAIDropdownItem[] = [
  { href: '/ai/receipt-to-excel', icon: ReceiptText, name: { id: 'Struk Belanja ke Excel', en: 'Image Receipt to Excel' }, desc: { id: 'Foto struk → Excel tervalidasi', en: 'Receipt photo → validated Excel' } },
  { href: '/ai/image-to-invoice', icon: FileSpreadsheet, name: { id: 'Foto ke Invoice', en: 'Image to Invoice' }, desc: { id: 'Foto invoice → PDF & Excel', en: 'Invoice photo → PDF & Excel' } },
  { href: '/ai/f-stream-spotify-promotion', icon: Headphones, name: { id: 'F-Stream Boost', en: 'F-Stream Boost' }, desc: { id: 'Promosi Spotify oleh AI agent', en: 'Spotify growth by AI agent' } },
  { href: '/blog', icon: FileText, name: { id: 'AI Blog', en: 'AI Blog' }, desc: { id: 'Wawasan AI & teknologi', en: 'AI & tech insights' } },
]

export function AgenticAIDropdown({ items = DEFAULT_ITEMS }: AgenticAIDropdownProps) {
  const { lang } = useLang()
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const label = 'Agentic AI'

  const menuItems = (items ?? DEFAULT_ITEMS).map((item) => {
    const name = typeof item.name === 'object' ? item.name[lang] ?? item.name.id : item.name
    const desc = typeof item.desc === 'object' ? item.desc[lang] ?? item.desc.id : item.desc
    return { ...item, name, desc }
  })

  return (
    <>
      {/* Desktop dropdown */}
      <div className="relative hidden md:block" ref={ref}>
        <Link
          href="/ai"
          onClick={(e) => {
            e.preventDefault()
            setOpen((v) => !v)
          }}
          aria-haspopup="true"
          aria-expanded={open}
          className="flex items-center gap-1 rounded-lg border border-transparent px-3 py-2 text-sm text-frsc-text-300 transition-all duration-200 hover:text-frsc-text-100 hover:bg-surface-hover"
        >
          {label}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </Link>

        {open && (
          <div className="absolute left-0 top-full mt-1 w-80 origin-top-left rounded-xl border border-surface-subtle bg-card p-1.5 shadow-xl shadow-black/10 backdrop-blur-xl z-50">
            <div className="px-3 pb-1 pt-2">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-frsc-crimson-400">
                <Sparkles className="h-3 w-3" />
                {lang === 'id' ? 'AI Agents & Tools' : 'AI Agents & Tools'}
              </p>
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-surface-hover"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-frsc-crimson-500/20">
                    <Icon className="h-4 w-4 text-frsc-crimson-400" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-frsc-text-100">{item.name}</span>
                    <span className="block truncate text-xs text-frsc-text-300/70">{item.desc}</span>
                  </span>
                </Link>
              )
            })}
            <div className="my-1 border-t border-surface-subtle" />
            <Link
              href="/ai"
              onClick={() => setOpen(false)}
              className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-frsc-crimson-400 transition-colors duration-150 hover:text-frsc-crimson-300"
            >
              {lang === 'id' ? 'Semua Agentic AI' : 'All Agentic AI'}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Mobile expandable accordion */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium text-frsc-text-300 hover:bg-surface-hover"
        >
          <span>{label}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${mobileOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {mobileOpen && (
          <div className="flex flex-col gap-0.5 pl-4">
            <Link
              href="/ai"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-frsc-crimson-400 hover:bg-surface-hover"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {lang === 'id' ? 'Semua Agentic AI' : 'All Agentic AI'}
            </Link>
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-frsc-text-300 hover:text-frsc-text-100 hover:bg-surface-hover"
                >
                  <Icon className="h-4 w-4 shrink-0 text-frsc-crimson-400" />
                  <span className="min-w-0">
                    <span className="block">{item.name}</span>
                    <span className="block truncate text-xs text-frsc-text-300/60">{item.desc}</span>
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}