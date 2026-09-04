'use client'

import { useMemo, useState, useCallback, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Clock, CalendarDays, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import type { BlogPost } from '@/lib/blog'
import type { Lang } from '@/lib/translations'

interface BlogHomeGridProps {
  posts: BlogPost[]
  lang: Lang
}

const PER_PAGE = 9

const CATEGORY_COLORS: Record<string, string> = {
  'AI Tools': 'bg-sky-500/10 text-sky-600 ring-1 ring-sky-500/30 dark:text-sky-300 dark:ring-sky-500/30',
  'Artificial Intelligence': 'bg-violet-500/10 text-violet-600 ring-1 ring-violet-500/30 dark:text-violet-300 dark:ring-violet-500/30',
  Cybersecurity: 'bg-red-500/10 text-red-600 ring-1 ring-red-500/30 dark:text-red-300 dark:ring-red-500/30',
  'Education & Tips': 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/30 dark:text-emerald-300 dark:ring-emerald-500/30',
  Technology: 'bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/30 dark:text-amber-300 dark:ring-amber-500/30',
  Tutorials: 'bg-fuchsia-500/10 text-fuchsia-600 ring-1 ring-fuchsia-500/30 dark:text-fuchsia-300 dark:ring-fuchsia-500/30',
}

function categoryBadge(category: string) {
  return (
    CATEGORY_COLORS[category] ??
    'bg-slate-500/10 text-slate-600 ring-1 ring-slate-500/30 dark:text-slate-300 dark:ring-slate-500/30'
  )
}

export function BlogHomeGrid({ posts, lang }: BlogHomeGridProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [currentCategory, setCurrentCategory] = useState<string>(
    () => searchParams.get('category') ?? '',
  )
  const [page, setPage] = useState(() => Math.max(1, Number(searchParams.get('page') ?? 1)))

  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const p of posts) {
      const t = p.translations[lang]
      if (t) set.add(t.category)
    }
    return Array.from(set).sort()
  }, [posts, lang])

  const filtered = useMemo(
    () =>
      posts.filter((p) => {
        const t = p.translations[lang]
        if (!t) return false
        if (currentCategory && t.category !== currentCategory) return false
        return true
      }),
    [posts, lang, currentCategory],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginated = useMemo(
    () => filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE),
    [filtered, safePage],
  )

  useEffect(() => {
    if (safePage !== page) setPage(safePage)
  }, [safePage, page])

  const updateUrl = useCallback(
    (cat: string, pg: number) => {
      const params = new URLSearchParams()
      if (cat) params.set('category', cat)
      if (pg > 1) params.set('page', String(pg))
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router],
  )

  const selectCategory = useCallback(
    (cat: string) => {
      setCurrentCategory((prev) => {
        const next = prev === cat ? '' : cat
        setPage(1)
        updateUrl(next, 1)
        return next
      })
    },
    [updateUrl],
  )

  const goToPage = useCallback(
    (pg: number) => {
      setPage(pg)
      updateUrl(currentCategory, pg)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [currentCategory, updateUrl],
  )

  const allLabel = lang === 'id' ? 'Semua' : 'All'
  const readLabel = lang === 'id' ? 'menit baca' : 'min read'
  const readMore = lang === 'id' ? 'Baca' : 'Read'
  const authorName = 'M. Faris Deni K.'

  return (
    <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2.5">
        <CategoryTab active={!currentCategory} onClick={() => selectCategory('')}>
          {allLabel}
        </CategoryTab>
        {categories.map((cat) => (
          <CategoryTab
            key={cat}
            active={currentCategory === cat}
            onClick={() => selectCategory(cat)}
          >
            {cat}
          </CategoryTab>
        ))}
      </div>

      {/* Grid */}
      {paginated.length === 0 ? (
        <div className="mt-20 text-center">
          <p className="text-frsc-text-300">
            {lang === 'id'
              ? 'Tidak ada artikel di kategori ini.'
              : 'No articles in this category yet.'}
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((post) => {
            const t = post.translations[lang]
            if (!t) return null
            return (
              <Link
                key={post.id}
                href={`/${lang}/blog/${t.slug}`}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-200 hover:border-frsc-crimson-500/40"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${categoryBadge(t.category)}`}
                    >
                      {t.category}
                    </span>
                  </div>
                  <h2 className="mt-3 font-heading text-lg font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-frsc-crimson-500">
                    {t.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {t.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {t.readTime}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 font-medium text-frsc-crimson-500">
                      {readMore}
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                  <div className="mt-3 text-[11px] text-muted-foreground">
                    {lang === 'id' ? 'Oleh' : 'By'} {authorName}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-14 flex items-center justify-center gap-2"
        >
          <PaginationButton
            disabled={safePage <= 1}
            onClick={() => goToPage(safePage - 1)}
            label={lang === 'id' ? 'Halaman sebelumnya' : 'Previous page'}
          >
            <ChevronLeft className="h-4 w-4" />
          </PaginationButton>
          {pageList(safePage, totalPages).map((p, i) =>
            p === 'ellipsis' ? (
              <span key={`e-${i}`} className="px-2 text-sm text-muted-foreground">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => goToPage(p)}
                aria-current={p === safePage ? 'page' : undefined}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                  p === safePage
                    ? 'border-frsc-crimson-500/40 bg-frsc-crimson-500/10 text-frsc-crimson-500'
                    : 'border-border text-muted-foreground hover:border-frsc-crimson-500/30 hover:text-frsc-crimson-500'
                }`}
              >
                {p}
              </button>
            ),
          )}
          <PaginationButton
            disabled={safePage >= totalPages}
            onClick={() => goToPage(safePage + 1)}
            label={lang === 'id' ? 'Halaman berikutnya' : 'Next page'}
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationButton>
        </nav>
      )}
    </div>
  )
}

function CategoryTab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-medium transition-colors duration-200 ${
        active
          ? 'border-frsc-crimson-500/40 bg-frsc-crimson-500/10 text-frsc-crimson-500'
          : 'border-border text-muted-foreground hover:border-frsc-crimson-500/30 hover:text-frsc-crimson-500'
      }`}
    >
      {children}
    </button>
  )
}

function PaginationButton({
  disabled,
  onClick,
  label,
  children,
}: {
  disabled: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-frsc-crimson-500/30 hover:text-frsc-crimson-500 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  )
}

function pageList(current: number, total: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = []
  const delta = 1
  const start = Math.max(2, current - delta)
  const end = Math.min(total - 1, current + delta)
  pages.push(1)
  if (start > 2) pages.push('ellipsis')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('ellipsis')
  if (total > 1) pages.push(total)
  return pages
}
