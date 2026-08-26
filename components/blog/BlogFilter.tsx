'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, Search, Clock, ArrowRight, X, Sparkles } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import type { BlogPost } from '@/lib/blog'
import type { Lang } from '@/lib/translations'

interface Labels {
  badge: string
  title: string
  description: string
  readLabel: string
  readMore: string
  searchPlaceholder: string
}

interface BlogFilterProps {
  posts: BlogPost[]
  lang: Lang
  labels: Labels
}

const chipActive = [
  'border-frsc-crimson-500/40',
  'bg-frsc-crimson-800/20',
  'text-frsc-crimson-300',
  'shadow-[inset_0_1px_0_rgba(224,48,78,0.15)]',
].join(' ')

const chipInactive = [
  'border-white/[0.07]',
  'bg-white/[0.02]',
  'text-frsc-text-200',
  'hover:border-frsc-crimson-500/25',
  'hover:bg-frsc-crimson-800/10',
  'hover:text-frsc-crimson-300',
].join(' ')

const revealDelays = [
  'reveal-delay-1',
  'reveal-delay-2',
  'reveal-delay-3',
  'reveal-delay-4',
  'reveal-delay-5',
  'reveal-delay-6',
] as const

export function BlogFilter({ posts, lang, labels }: BlogFilterProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [page, setPage] = useState(() => {
    const p = searchParams.get('page')
    return p ? Math.max(1, Number(p)) : 1
  })

  const PER_PAGE = 9

  const isMac =
    typeof navigator !== 'undefined' &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const categories = useMemo(() => {
    const cats = new Set<string>()
    for (const post of posts) {
      const t = post.translations[lang]
      if (t) cats.add(t.category)
    }
    return Array.from(cats).sort()
  }, [posts, lang])

  const filtered = useMemo(
    () =>
      posts.filter((post) => {
        const t = post.translations[lang]
        if (!t) return false
        if (category && t.category !== category) return false
        if (!query) return true
        const q = query.toLowerCase()
        return (
          t.title.toLowerCase().includes(q) ||
          t.excerpt.toLowerCase().includes(q) ||
          t.keywords.some((k) => k.toLowerCase().includes(q))
        )
      }),
    [posts, lang, category, query],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginatedPosts = useMemo(
    () => filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE),
    [filtered, safePage],
  )

  useEffect(() => {
    if (safePage !== page) {
      setPage(safePage)
    }
  }, [safePage, page])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
    const params = new URLSearchParams(searchParams.toString())
    if (newPage <= 1) {
      params.delete('page')
    } else {
      params.set('page', String(newPage))
    }
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [searchParams, pathname, router])

  const handleCategoryChange = useCallback((cat: string) => {
    setCategory(cat)
    setPage(1)
  }, [])

  const handleQueryChange = useCallback((q: string) => {
    setQuery(q)
    setPage(1)
  }, [])

  const allLabel = lang === 'id' ? 'Semua' : 'All'

  return (
    <>
      {/* ══════════════════════════════════════════════
          HERO — two-column layout
          ══════════════════════════════════════════════ */}
      <section className="relative mx-auto w-full max-w-7xl px-4 py-14 lg:px-6">
        {/* Ambient glow layers */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-frsc-crimson-500/6 blur-3xl" />
          <div className="absolute -right-40 top-1/3 h-80 w-80 rounded-full bg-frsc-purple-500/5 blur-3xl" />
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* ── Left column ── */}
          <div>
            <span className="eyebrow-label text-eyebrow text-frsc-crimson-400 mb-5 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {labels.badge}
            </span>
            <h1 className="heading-fluid text-hero text-frsc-white-bright text-balance">
              {labels.title}
            </h1>
            <p className="mt-5 max-w-lg text-pretty text-lead leading-relaxed text-frsc-text-200 lg:mt-6">
              {labels.description}
            </p>
          </div>

          {/* ── Right column — search ── */}
          <div className="lg:pl-10 lg:pt-[3.5rem] xl:pl-14">
            {/* Search glass card wrapper */}
            <div className="relative rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-1 shadow-[0_4px_24px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-shadow duration-300 focus-within:border-frsc-crimson-500/30 focus-within:shadow-[0_0_0_1px_rgba(224,48,78,0.08),0_8px_32px_rgba(224,48,78,0.06)]">
              <div className="relative">
                <Search
                  className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors duration-200 ${
                    focused ? 'text-frsc-crimson-400' : 'text-frsc-text-300/40'
                  }`}
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder={labels.searchPlaceholder}
                  className="w-full rounded-xl border-0 bg-transparent py-[18px] pl-12 pr-36 text-[15px] text-frsc-white-bright placeholder:text-frsc-text-300/30 transition-all duration-200 focus:outline-none"
                />

                {/* Right adornments: clear + shortcut */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        handleQueryChange('')
                        inputRef.current?.focus()
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-frsc-text-300/40 transition-colors hover:bg-white/[0.06] hover:text-frsc-text-200"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <kbd className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.04] px-2 py-1 text-[11px] font-medium leading-none text-frsc-text-300/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                    {isMac ? '⌘' : 'Ctrl'}
                    <span className="text-[10px]">K</span>
                  </kbd>
                </div>
              </div>
            </div>

            {/* Hint text */}
            <p className="mt-2.5 text-[11px] text-frsc-text-300/30">
              Tekan {isMac ? '⌘K' : 'Ctrl+K'} untuk fokus — filter berdasarkan judul, konten, atau kata kunci
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CATEGORY NAVIGATION
          ══════════════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-16 sm:pt-20 lg:px-6">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleCategoryChange('')}
            className={`rounded-full border px-[18px] py-2 text-xs font-medium transition-all duration-300 ${
              !category ? chipActive : chipInactive
            }`}
          >
            {allLabel}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat === category ? '' : cat)}
              className={`rounded-full border px-[18px] py-2 text-xs font-medium transition-all duration-300 ${
                category === cat ? chipActive : chipInactive
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ARTICLE GRID
          ══════════════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-28 pt-14 lg:px-6 lg:pb-32">
        {filtered.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-base text-frsc-text-300">
              {lang === 'id'
                ? 'Tidak ada artikel yang ditemukan. Coba kata kunci lain.'
                : 'No articles found. Try different keywords.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((post, i) => {
                const t = post.translations[lang]
                if (!t) return null
                return (
                  <Link
                    key={post.id}
                    href={`/${lang}/blog/${t.slug}`}
                    className={`group reveal-on-scroll reveal-stagger ${revealDelays[i % revealDelays.length]} flex`}
                  >
                    <GlassCard
                      variant="default"
                      blur="light"
                      withReflection={true}
                      withAccent="crimson"
                      className="hover-lift flex h-full w-full flex-col overflow-hidden"
                    >
                      {/* Thumbnail — 12:5 aspect ratio */}
                      <div className="relative z-[2] aspect-[12/5] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.image}
                          alt={post.imageAlt}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      </div>

                      {/* Card body */}
                      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                        {/* Category + Date */}
                        <div className="flex items-center justify-between">
                          <span className="rounded-full border border-frsc-crimson-700/30 bg-frsc-crimson-800/20 px-2.5 py-0.5 text-[11px] font-medium text-frsc-crimson-300">
                            {t.category}
                          </span>
                          <span className="text-[11px] text-frsc-text-300/50">
                            {post.date}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="mt-3 font-heading text-base font-semibold leading-snug text-frsc-white-bright transition-colors duration-300 group-hover:text-frsc-crimson-400">
                          {t.title}
                        </h2>

                        {/* Description */}
                        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-frsc-text-200 line-clamp-2">
                          {t.excerpt}
                        </p>

                        {/* Footer: read time + CTA */}
                        <div className="mt-4 flex items-center justify-between border-t border-white/[0.04] pt-3">
                          <div className="flex items-center gap-1.5 text-[11px] text-frsc-text-300/50">
                            <Clock className="h-3.5 w-3.5" />
                            {t.readTime}
                          </div>
                          <span className="flex items-center gap-1 text-[11px] font-medium text-frsc-crimson-400 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
                            {labels.readMore}
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                )
              })}
            </div>
            {totalPages > 1 && (
              <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(safePage - 1)}
                  disabled={safePage <= 1}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-frsc-text-300/60 transition-colors hover:bg-white/[0.03] hover:text-frsc-text-200 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {(() => {
                  const pages: (number | 'ellipsis')[] = []
                  const delta = 1
                  const rangeStart = Math.max(2, safePage - delta)
                  const rangeEnd = Math.min(totalPages - 1, safePage + delta)
                  pages.push(1)
                  if (rangeStart > 2) pages.push('ellipsis')
                  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i)
                  if (rangeEnd < totalPages - 1) pages.push('ellipsis')
                  if (totalPages > 1) pages.push(totalPages)
                  return pages.map((p, i) =>
                    p === 'ellipsis' ? (
                      <span key={`ellipsis-${i}`} className="flex h-9 w-9 items-center justify-center text-xs text-frsc-text-300/40">...</span>
                    ) : (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handlePageChange(p)}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-medium transition-colors ${
                          p === safePage
                            ? 'border-white/[0.06] bg-white/[0.04] text-frsc-white-bright'
                            : 'border-transparent text-frsc-text-300/60 hover:border-white/[0.06] hover:bg-white/[0.03] hover:text-frsc-text-200'
                        }`}
                        aria-label={`Page ${p}`}
                        aria-current={p === safePage ? 'page' : undefined}
                      >
                        {p}
                      </button>
                    ),
                  )
                })()}
                <button
                  type="button"
                  onClick={() => handlePageChange(safePage + 1)}
                  disabled={safePage >= totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-frsc-text-300/60 transition-colors hover:bg-white/[0.03] hover:text-frsc-text-200 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </>
  )
}
