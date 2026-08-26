import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { getFeaturedPosts } from '@/lib/blog'
import type { Lang } from '@/lib/translations'
import type { BlogPost } from '@/lib/blog'

interface Props {
  lang?: Lang
}

const posts = getFeaturedPosts(3)

const categoryColors: Record<string, string> = {
  // Tutorials / how-to
  Tutorial: 'border-frsc-crimson-700/30 bg-frsc-crimson-800/20 text-frsc-crimson-300',
  Tutorials: 'border-frsc-crimson-700/30 bg-frsc-crimson-800/20 text-frsc-crimson-300',
  // AI / Technology
  'Artificial Intelligence': 'border-frsc-purple-700/25 bg-frsc-purple-800/15 text-frsc-purple-300',
  Teknologi: 'border-frsc-purple-700/25 bg-frsc-purple-800/15 text-frsc-purple-300',
  Technology: 'border-frsc-purple-700/25 bg-frsc-purple-800/15 text-frsc-purple-300',
  // Comparisons
  Perbandingan: 'border-white/15 bg-white/[0.04] text-frsc-platinum',
  Comparisons: 'border-white/15 bg-white/[0.04] text-frsc-platinum',
  // Education & Tips
  'Edukasi & Tips': 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  'Education & Tips': 'border-amber-500/25 bg-amber-500/10 text-amber-300',
}

// Fallback agar tag kategori barubarus tetap tampil dengan warna default (premium ink).
const defaultCategoryColor = 'border-white/10 bg-white/[0.04] text-frsc-text-200'

const labels = {
  id: { badge: 'Blog', heading: 'Artikel Terbaru', cta: 'Lihat Semua', readLabel: 'baca' },
  en: { badge: 'Blog', heading: 'Latest Articles', cta: 'View All', readLabel: 'min read' },
}

const revealDelays = [
  'reveal-delay-1',
  'reveal-delay-2',
  'reveal-delay-3',
  'reveal-delay-4',
  'reveal-delay-5',
  'reveal-delay-6',
] as const

export function BlogSection({ lang = 'id' }: Props) {
  const label = labels[lang] ?? labels.id
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:py-24 lg:px-6" aria-labelledby="blog-heading">
      {/* Subtle background ambient */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-frsc-purple-500/4 blur-3xl" />
      </div>

      <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="eyebrow-label text-eyebrow text-frsc-crimson-400">{label.badge}</span>
          <h2 id="blog-heading" className="heading-fluid text-h2 text-frsc-text-100 text-balance">
            {label.heading}
          </h2>
        </div>
        <Link href="/blog" className="group/btn inline-block">
          <GlassCard variant="subtle" blur="light" withReflection={false} withAccent="crimson" className="px-4 py-2 transition-all duration-300 hover:shadow-metallic-lg">
            <span className="flex items-center gap-1.5 text-sm font-medium text-frsc-text-200 transition-colors duration-300 group-hover/btn:text-frsc-platinum">
              {label.cta} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </span>
          </GlassCard>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => {
          const p = post.translations[lang] ?? post.translations.id
          if (!p) return null
          return (
          <Link
            key={p.slug}
            href={`/${lang}/blog/${p.slug}`}
            className={`group/blog reveal-on-scroll reveal-stagger ${revealDelays[i % revealDelays.length]} flex flex-col`}
          >
            <GlassCard
              variant="default"
              blur="light"
              withReflection={true}
              withAccent="crimson"
              className="flex flex-col overflow-hidden p-0 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-metallic-lg"
            >
              <div className="relative aspect-[12/5] w-full overflow-hidden bg-frsc-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.imageAlt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover/blog:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-frsc-black via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 z-[2]">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors duration-300 ${categoryColors[p.category] ?? defaultCategoryColor}`}>
                    {p.category}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-heading text-base font-semibold leading-snug text-frsc-text-100 transition-colors duration-300 group-hover/blog:text-frsc-crimson-300">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-frsc-text-300 line-clamp-2">{p.excerpt}</p>
                <div className="mt-auto flex items-center gap-1.5 pt-4 text-xs text-frsc-text-300">
                  <Clock className="h-3.5 w-3.5" />
                  {p.readTime}
                </div>
              </div>
            </GlassCard>
          </Link>
        )})}
      </div>
    </section>
  )
}
