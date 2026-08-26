import Link from 'next/link'
import type { BlogPost } from '@/lib/blog'
import type { Lang } from '@/lib/translations'
import { GlassCard } from '@/components/ui/GlassCard'
import { ArrowRight, Clock } from 'lucide-react'

interface Labels {
  readLabel: string
  readMore: string
}

export function RelatedPosts({
  posts,
  lang,
  labels,
}: {
  posts: BlogPost[]
  lang: Lang
  labels: Labels
}) {
  if (posts.length === 0) return null

  return (
    <section className="mt-14 border-t border-white/[0.06] pt-10">
      <h2 className="mb-6 font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {lang === 'id' ? 'Artikel Terkait' : 'Related Articles'}
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const t = post.translations[lang]
          return (
            <Link key={post.id} href={`/${lang}/blog/${t.slug}`} className="group block">
              <GlassCard
                variant="subtle"
                blur="light"
                withReflection={false}
                withAccent="none"
                className="h-full p-5 transition-all duration-300 group-hover:border-white/[0.12]"
              >
                <div className="relative z-[2] flex h-full flex-col">
                  <span className="mb-2 inline-block rounded-full bg-frsc-crimson-800/20 px-2.5 py-0.5 text-xs font-medium text-frsc-crimson-300">
                    {t.category}
                  </span>
                  <h3 className="mb-2 font-heading text-sm font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-frsc-crimson-300">
                    {t.title}
                  </h3>
                  <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-frsc-text-300">
                    {t.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-frsc-text-300">
                      <Clock className="h-3 w-3" />
                      {t.readTime}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-frsc-crimson-300 opacity-0 transition-all duration-200 group-hover:opacity-100">
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
    </section>
  )
}
