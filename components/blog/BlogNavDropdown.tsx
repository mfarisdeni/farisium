'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { useLang } from '@/hooks/useLang'

interface BlogNavDropdownProps {
  categories: string[]
}

export function BlogNavDropdown({ categories }: BlogNavDropdownProps) {
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

  const blogHref = `/${lang}/blog`

  return (
    <>
      {/* Desktop dropdown */}
      <div className="relative hidden md:block" ref={ref}>
        <Link
          href={blogHref}
          onClick={(e) => {
            e.preventDefault()
            setOpen((v) => !v)
          }}
          aria-haspopup="true"
          aria-expanded={open}
          className="flex items-center gap-1 rounded-lg border border-transparent px-3 py-2 text-sm text-frsc-text-300 transition-all duration-200 hover:text-frsc-text-100 hover:bg-surface-hover"
        >
          Blog
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </Link>

        {open && (
          <div className="absolute left-0 top-full mt-1 w-60 origin-top-left rounded-xl border border-surface-subtle bg-card p-1.5 shadow-xl shadow-black/10 backdrop-blur-xl z-50">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/${lang}/blog?category=${encodeURIComponent(cat)}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-frsc-text-200 transition-colors duration-150 hover:bg-surface-hover hover:text-frsc-crimson-400"
              >
                {cat}
              </Link>
            ))}
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
          <span>Blog</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${mobileOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {mobileOpen && (
          <div className="flex flex-col gap-0.5 pl-4">
            <Link
              href={blogHref}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-2.5 text-sm text-frsc-text-300 hover:text-frsc-text-100 hover:bg-surface-hover"
            >
              {lang === 'id' ? 'Semua Artikel' : 'All Articles'}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/${lang}/blog?category=${encodeURIComponent(cat)}`}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm text-frsc-text-300 hover:text-frsc-text-100 hover:bg-surface-hover"
              >
                {cat}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
