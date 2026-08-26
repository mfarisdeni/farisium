import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ScrollReveal } from '@/components/scroll-reveal'
import {
  getPostBySlug,
  getAllPosts,
  generatePostSchema,
  generateFAQSchema,
  extractFAQs,
  extractHeadings,
  getRelatedPosts,
  generateBreadcrumbSchema,
  parseDate,
  getPostLangFromSlug,
  getPostSlugForLocale,
  type BlogSection,
} from '@/lib/blog'
import type { Lang } from '@/lib/translations'
import { detectLocale, COOKIE_NAME, locales, type Locale, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import { GlassCard } from '@/components/ui/GlassCard'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { ArticleBreadcrumb } from '@/components/blog/ArticleBreadcrumb'
import { ArticleFAQ } from '@/components/blog/ArticleFAQ'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { AdSlot } from '@/components/ad-slot'

interface Props {
  params: Promise<{ slug: string }>
}

/**
 * Trim a description to maxLen characters at the last word boundary.
 * Ensures SEO meta description stays within 140-155 char sweet spot.
 */
function trimMetaDescription(text: string, maxLen = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= maxLen) return clean
  const sliced = clean.slice(0, maxLen)
  const lastSpace = sliced.lastIndexOf(' ')
  return (lastSpace > maxLen * 0.7 ? sliced.slice(0, lastSpace) : sliced).trim() + '...'
}

/** Short brand suffix keeps more room for the article title in SERP. */
const TITLE_SUFFIX = ' – Farisium'
const SEO_TITLE_MAX = 60

/**
 * Build an SEO-safe page title: append a short brand suffix and truncate the
 * main title at a word boundary when the total exceeds ~60 characters.
 * Truncating from the end keeps the primary keyword at the front intact.
 */
function buildSeoTitle(title: string, maxLen = SEO_TITLE_MAX): string {
  const clean = title.replace(/\s+/g, ' ').trim()
  const budget = maxLen - TITLE_SUFFIX.length
  if (clean.length <= budget) return clean + TITLE_SUFFIX
  const sliced = clean.slice(0, budget)
  const lastSpace = sliced.lastIndexOf(' ')
  const truncated = lastSpace > budget * 0.6 ? sliced.slice(0, lastSpace) : sliced
  return truncated.trimEnd() + TITLE_SUFFIX
}

export async function generateStaticParams() {
  const params: Array<{ slug: string }> = []
  for (const post of getAllPosts()) {
    for (const locale of locales) {
      const t = post.translations[locale as keyof typeof post.translations]
      if (t && t.slug && !params.find((p) => p.slug === t.slug)) {
        params.push({ slug: t.slug })
      }
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) return {}

  // Determine the article's canonical language from the slug itself.
  // Every slug uniquely belongs to one locale, making it the source of truth.
  const articleLang = getPostLangFromSlug(slug)
  if (!articleLang) return {}

  const t = post.translations[articleLang]!

  const canonicalSlug = t.slug
  const canonicalUrl = getCanonicalUrl(articleLang, `/blog/${canonicalSlug}`)

  // Build hreflang: only include locales that have genuine translations
  const altLangs: Array<{ lang: Locale; href: string }> = []
  for (const locale of locales) {
    const localeSlug = post.translations[locale]?.slug
    if (localeSlug) {
      altLangs.push({
        lang: locale,
        href: `https://farisium.com/${locale}/blog/${localeSlug}`,
      })
    }
  }

  // SEO title: "{{Article Title}} – Farisium", truncated to ≤60 chars total.
  const title = { absolute: buildSeoTitle(t.title) }

  // Description: trim excerpt to 140-155 chars at word boundary for SEO.
  const description = trimMetaDescription(t.excerpt, 155)
  const publishedIso = parseDate(post.date).toISOString()

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(altLangs.map(a => [a.lang, a.href])),
    },
    openGraph: {
      title: title.absolute,
      description,
      url: canonicalUrl,
      type: 'article',
      locale: articleLang === 'id' ? 'id_ID' : 'en_US',
      siteName: 'Farisium',
      publishedTime: publishedIso,
      modifiedTime: publishedIso,
      authors: ['Farisium'],
      images: [
        {
          url: `https://farisium.com${post.image}`,
          width: 1200,
          height: 630,
          alt: post.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title.absolute,
      description,
      images: [`https://farisium.com${post.image}`],
    },
    keywords: t.keywords.join(', '),
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  }
}

const categoryColors: Record<string, string> = {
  Tutorial: 'text-frsc-crimson-300 bg-frsc-crimson-800/20 border-frsc-crimson-700/30',
  Panduan: 'text-frsc-crimson-300 bg-frsc-crimson-800/20 border-frsc-crimson-700/30',
  Teknologi: 'text-frsc-crimson-300 bg-frsc-crimson-800/20 border-frsc-crimson-700/30',
  Platform: 'text-frsc-crimson-300 bg-frsc-crimson-800/20 border-frsc-crimson-700/30',
  'Artificial Intelligence': 'text-frsc-crimson-300 bg-frsc-crimson-800/20 border-frsc-crimson-700/30',
  Tutorials: 'text-frsc-crimson-300 bg-frsc-crimson-800/20 border-frsc-crimson-700/30',
  Technology: 'text-frsc-crimson-300 bg-frsc-crimson-800/20 border-frsc-crimson-700/30',
  Guide: 'text-frsc-crimson-300 bg-frsc-crimson-800/20 border-frsc-crimson-700/30',
}

/**
 * Track internal link repetitions across a single article.
 * Max 2 occurrences per same internal URL — subsequent ones render as plain text.
 */
type LinkTracker = Map<string, number>

function renderRichText(text: string, tracker?: LinkTracker, articleLang?: Lang) {
  const parts = text.split(/(\[\[[^\]]+\]\([^)]+\)\])/g)
  return parts.map((part, i) => {
    const match = part.match(/^\[\[([^\]]+)\]\(([^)]+)\)\]$/)
    if (!match) return part

    const label = match[1]
    let url = match[2]
    const isExternal = url.startsWith('http')

    // Prepend locale to internal links so crawlers get the right language
    // without an extra redirect hop.
    if (!isExternal && articleLang && url.startsWith('/')) {
      url = `/${articleLang}${url}`
    }

    // Dedup: internal links max 2x per URL per article
    if (!isExternal && tracker) {
      const count = (tracker.get(url) ?? 0) + 1
      tracker.set(url, count)
      if (count > 2) return <span key={i}>{label}</span>
    }

    return (
      <a
        key={i}
        href={url}
        target="_blank"
        rel={isExternal ? 'noopener noreferrer' : 'noopener'}
        className="font-semibold text-frsc-crimson-400 transition-colors hover:text-frsc-crimson-300"
      >
        {label}
        {isExternal && (
          <>
            {' '}<span className="text-xs text-frsc-purple-400">&#x2197;</span>
          </>
        )}
      </a>
    )
  })
}

/**
 * In-article ad placement plan: after every 3, then alternating 2/3, H2
 * sections — never after the last H2 (nothing follows to separate).
 * Short articles (≤3 H2) get no inline ads; long ones are capped so the
 * content-to-ad ratio stays within AdSense density policy.
 */
const INLINE_AD_MAX = 3

function buildInlineAdThresholds(h2Total: number): number[] {
  const thresholds: number[] = []
  let seen = 0
  for (let step = 0; thresholds.length < INLINE_AD_MAX; step++) {
    seen += step % 2 === 0 ? 3 : 2
    if (seen >= h2Total) break
    thresholds.push(seen)
  }
  return thresholds
}

function PostBody({ sections, articleLang }: { sections: BlogSection[]; articleLang?: Lang }) {
  // Persists across all renderRichText calls within this article.
  const tracker: LinkTracker = new Map()

  const h2Total = sections.filter((s) => s.type === 'heading' && s.level === 2).length
  const adThresholds = buildInlineAdThresholds(h2Total)

  const blocks: ReactNode[] = []
  let h2Seen = 0
  let adIdx = 0

  sections.forEach((section, i) => {
    const isH2 = section.type === 'heading' && section.level === 2

    // Inline ad between sections — skipped when it would sit right below an
    // internal promo CTA (mixing own CTAs with Google ads hurts both CTRs).
    if (
      isH2 &&
      adIdx < adThresholds.length &&
      h2Seen === adThresholds[adIdx] &&
      sections[i - 1]?.type !== 'cta'
    ) {
      blocks.push(
        <AdSlot key={`ad-${i}`} slot="slotA" width={300} height={250} className="mx-auto my-8" />,
      )
      adIdx++
    }
    if (isH2) h2Seen++

    switch (section.type) {
      case 'heading': {
        const Tag = section.level === 2 ? 'h2' : 'h3'
        const size =
          section.level === 2 ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
        const pt = section.level === 2 ? 'pt-10' : 'pt-6'
        blocks.push(
          <Tag
            key={i}
            id={section.text?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}
            className={`${pt} font-sans font-bold tracking-tight text-foreground ${size} scroll-mt-24`}
          >
            {section.text}
          </Tag>,
        )
        break
      }
      case 'paragraph':
        blocks.push(
          <p key={i} className="text-base leading-relaxed text-frsc-text-200">
            {renderRichText(section.text ?? '', tracker, articleLang)}
          </p>,
        )
        break
      case 'list':
        blocks.push(
          <ul key={i} className="list-disc space-y-2 pl-6 text-base leading-relaxed text-frsc-text-200">
            {section.items?.map((item, j) => (
              <li key={j}>{renderRichText(item, tracker, articleLang)}</li>
            ))}
          </ul>,
        )
        break
      case 'image':
        blocks.push(
          <figure key={i} className="my-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={section.src ?? ''}
              alt={section.alt ?? ''}
              className="w-full rounded-2xl border border-white/[0.06] object-cover shadow-metallic"
              loading="lazy"
            />
            {section.caption && (
              <figcaption className="mt-3 text-center text-sm text-frsc-text-300">
                {section.caption}
              </figcaption>
            )}
          </figure>,
        )
        break
      case 'links':
        blocks.push(
          <div key={i} className="my-8 space-y-3 rounded-2xl border border-white/[0.08] bg-frsc-black/60 p-5">
            <p className="mb-3 eyebrow-label text-[11px] text-frsc-text-300">Link Terkait</p>
            {section.links?.map((link, j) => (
              <a
                key={j}
                href={link.href}
                target="_blank"
                rel={link.external ? 'noopener noreferrer' : 'noopener'}
                className="group/link flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-frsc-crimson-400 transition-all duration-200 hover:bg-frsc-crimson-800/10 hover:text-frsc-crimson-300"
              >
                <span className="flex-1">{link.text}</span>
                <span className="shrink-0 text-xs transition-transform duration-200 group-hover/link:scale-110">
                  {link.external ? '↗' : '→'}
                </span>
              </a>
            ))}
          </div>,
        )
        break
      case 'cta':
        blocks.push(
          <GlassCard key={i} variant="default" blur="light" withReflection={true} withAccent="crimson" className="my-10 p-6 text-center sm:p-8">
            <div className="relative z-[2]">
              <p className="mb-4 text-base font-semibold text-frsc-white-bright">
                {section.text}
              </p>
              <Link
                href={section.href ?? '#'}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_24px_rgba(224,48,78,0.35)]"
              >
                {section.label}
              </Link>
            </div>
          </GlassCard>,
        )
        break
      default:
        break
    }
  })

  return (
    <div className="space-y-5" style={{ fontFamily: 'var(--font-geist)' }}>
      {blocks}
    </div>
  )
}

const labels = {
  id: { home: 'Beranda', blog: 'Blog', back: 'Kembali ke Blog', readLabel: 'baca', readMore: 'Baca' },
  en: { home: 'Home', blog: 'Blog', back: 'Back to Blog', readLabel: 'min read', readMore: 'Read' },
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  // Determine the article's canonical language from the slug itself.
  const articleLang = getPostLangFromSlug(slug)
  if (!articleLang) notFound()

  // Determine the URL locale from the rewritten path.
  // The middleware rewrites /<locale>/... → /... and sets a cookie.
  // For crawlers without cookies, detectLocale defaults to 'en'.
  // We use the slug to determine the correct language, then redirect
  // if the URL locale doesn't match.
  const cookieStore = await cookies()
  const urlLocale = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  if (urlLocale !== articleLang) {
    // The URL locale doesn't match the article's language.
    // Redirect to the correct locale URL.
    redirect(getCanonicalUrl(articleLang, `/blog/${slug}`))
  }

  const t = post.translations[articleLang]!
  const label = labels[articleLang] ?? labels.id

  // Filter out FAQ sections from body to avoid duplication with ArticleFAQ component.
  // The FAQ heading and all following H3+paragraph Q&A pairs are rendered separately.
  const faqHeadingPattern = /^(pertanyaan umum|frequently asked questions|faq)/i
  let contentEndIndex = t.content.length
  for (let i = 0; i < t.content.length; i++) {
    const s = t.content[i]
    if (s.type === 'heading' && s.level === 2 && s.text && faqHeadingPattern.test(s.text)) {
      contentEndIndex = i
      break
    }
  }
  const bodyContent = t.content.slice(0, contentEndIndex)

  const headings = extractHeadings(bodyContent)
  const faqs = extractFAQs(t.content)
  const relatedPosts = getRelatedPosts(t.slug, t.category, articleLang)

  const blogSchema = generatePostSchema(post, articleLang, t.slug)
  const faqSchema = faqs.length > 0 ? generateFAQSchema(faqs) : null

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: label.home, item: getCanonicalUrl(articleLang, '/') },
    { name: 'Blog', item: getCanonicalUrl(articleLang, '/blog') },
    { name: t.title, item: getCanonicalUrl(articleLang, `/blog/${t.slug}`) },
  ])

  const breadcrumbItems = [
    { label: label.home, href: '/' },
    { label: label.blog, href: '/blog' },
    { label: t.title },
  ]

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      <main className="flex-1">
        <article className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20" style={{ fontFamily: 'var(--font-geist)' }}>
          {/* Breadcrumb */}
          <ArticleBreadcrumb items={breadcrumbItems} />

          {/* Header */}
          <header className="mb-10">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryColors[t.category] ?? 'text-frsc-crimson-300 bg-frsc-crimson-800/20 border-frsc-crimson-700/30'}`}
              >
                {t.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-frsc-text-300">
                <Calendar className="h-3.5 w-3.5" />
                {post.date}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-frsc-text-300">
                <Clock className="h-3.5 w-3.5" />
                {t.readTime}
              </div>
            </div>

            <h1 className="heading-fluid text-h1 text-foreground text-balance">
              {t.title}
            </h1>
            <p className="mt-4 text-pretty text-lead leading-relaxed text-frsc-text-200">
              {t.excerpt}
            </p>
          </header>

          {/* Featured image */}
          <GlassCard variant="subtle" blur="light" withReflection={false} withAccent="crimson" className="mb-10 overflow-hidden !p-0 border-0">
            <div className="relative z-[2]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.imageAlt}
                className="w-full object-cover"
              />
            </div>
          </GlassCard>

          {/* Ad: leaderboard — natural break before reading starts */}
          <AdSlot slot="slotB" width={728} height={90} className="mx-auto mb-10" />

          {/* Table of Contents */}
          <TableOfContents headings={headings} />

          {/* Article body */}
          <PostBody sections={bodyContent} articleLang={articleLang} />

          {/* FAQ Section */}
          <ArticleFAQ items={faqs} lang={articleLang} />

          {/* Ad: large rectangle — engaged readers, higher RPM */}
          <AdSlot slot="slotC" width={336} height={280} className="mx-auto my-10" />

          {/* Related Posts */}
          <RelatedPosts
            posts={relatedPosts}
            lang={articleLang}
            labels={{ readLabel: label.readLabel, readMore: label.readMore }}
          />

          {/* Author bio */}
          <div className="mt-14 rounded-2xl border border-white/[0.08] bg-frsc-black/60 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <img
                src="/faris.webp"
                alt="M. Faris Deni K."
                className="h-14 w-14 shrink-0 rounded-full border border-white/[0.08] object-cover"
                loading="lazy"
              />
              <div className="min-w-0">
                <p className="font-heading text-sm font-semibold text-frsc-white-bright">
                  M. Faris Deni K.
                </p>
                <p className="mt-0.5 text-xs text-frsc-text-300">
                  {articleLang === 'id'
                    ? 'Founder & Pengembang Farisium. Menulis tentang AI, teknologi, dan pengembangan platform.'
                    : 'Founder & Developer of Farisium. Writing about AI, technology, and platform development.'}
                </p>
              </div>
            </div>
          </div>

          {/* Back to blog */}
          <div className="mt-8 border-t border-white/[0.06] pt-8">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-sm font-medium text-frsc-text-200 transition-colors hover:text-frsc-white-bright"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              {label.back}
            </Link>
          </div>
        </article>
      </main>

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <SiteFooter />
      <ScrollReveal />
    </div>
  )
}
