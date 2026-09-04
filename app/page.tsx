import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowRight, Clock, CalendarDays } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ScrollReveal } from '@/components/scroll-reveal'
import { BlogHomeGrid } from '@/components/home/BlogHomeGrid'
import {
  getAllPosts,
  getBlogCategories,
  parseDate,
} from '@/lib/blog'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang
  const path = '/'

  const titles = {
    id: 'Farisium — Blog AI, Teknologi, Tutorial & Review Tools',
    en: 'Farisium — AI & Technology Blog: Tutorials, Tools & Insights',
  }
  const descriptions = {
    id: 'Blog AI dan teknologi terlengkap — panduan, tutorial, review tools AI, berita terkini, dan strategi untuk kreator, developer, dan bisnis.',
    en: 'Your go-to AI and technology blog — in-depth tutorials, tool reviews, industry news, and practical strategies for creators, developers, and businesses.',
  }
  const canonicalUrl = getCanonicalUrl(lang, path)
  const alternates = getHreflangLinks(path, lang)
  return {
    title: { default: titles[lang], template: '%s | Farisium' },
    description: descriptions[lang],
    metadataBase: new URL('https://farisium.com'),
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(alternates.map((a) => [a.lang, a.href])),
    },
    openGraph: {
      type: 'website',
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      url: canonicalUrl,
      siteName: 'Farisium',
      title: titles[lang],
      description: descriptions[lang],
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Farisium Blog' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  }
}

export default async function HomePage() {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang
  const posts = getAllPosts()
  const categories = getBlogCategories(lang)

  const featured = posts[0]
  const featuredT = featured?.translations[lang]

  const pageDescriptions = {
    id: 'Baca artikel, tutorial, dan berita terbaru seputar AI, teknologi, dan ekosistem Farisium.',
    en: 'Read the latest articles, tutorials, and news about AI, technology, and the Farisium ecosystem.',
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: posts
      .filter((p) => p.translations[lang])
      .map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: getCanonicalUrl(lang, `/blog/${p.translations[lang]!.slug}`),
      }))
      .slice(0, 20),
  }

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: lang === 'id' ? 'Blog Farisium' : 'Farisium Blog',
    url: getCanonicalUrl(lang, '/'),
    description: pageDescriptions[lang],
    inLanguage: lang,
    blogPost: posts
      .filter((p) => p.translations[lang])
      .slice(0, 5)
      .map((p) => ({
        '@type': 'BlogPosting',
        headline: p.translations[lang]!.title,
        datePublished: parseDate(p.date).toISOString(),
        url: getCanonicalUrl(lang, `/blog/${p.translations[lang]!.slug}`),
      })),
  }

  const latestLabel = lang === 'id' ? 'Artikel Terbaru' : 'Latest Articles'
  const readLabel = lang === 'id' ? 'menit baca' : 'min read'
  const authorName = 'M. Faris Deni K.'

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar categories={categories} />
      <main className="flex-1">
        {/* Hero — SEO-first with tech vibes background */}
        <section className="hero-bg relative">
          {/* Ambient gradient orbs */}
          <div className="hero-orb pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-16 pb-12 lg:px-6 lg:pt-24 lg:pb-16">
            <span className="inline-block rounded-full border border-frsc-crimson-500/20 bg-frsc-crimson-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-frsc-crimson-500">
              {lang === 'id' ? 'Blog AI & Teknologi' : 'AI & Technology Blog'}
            </span>

            <h1 className="mt-6 max-w-4xl text-[clamp(2rem,5vw,3.5rem)] font-heading font-bold leading-[1.08] tracking-tight text-foreground">
              {lang === 'id'
                ? 'Farisium — Artikel AI, Tutorial & Berita Teknologi Terbaru'
                : 'Farisium — AI Articles, Tutorials & Technology News'}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {lang === 'id'
                ? 'Blog AI dan teknologi terlengkap — panduan praktis, review tools, strategi produktivitas, dan berita terkini untuk kreator, developer, dan bisnis.'
                : 'Your go-to AI and technology blog — in-depth tutorials, tool reviews, productivity strategies, and the latest industry news for creators, developers, and businesses.'}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={`/${lang}/blog`}
                className="inline-flex items-center gap-2 rounded-xl bg-frsc-crimson-500 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-frsc-crimson-600"
              >
                {lang === 'id' ? 'Baca Semua Artikel' : 'Explore All Articles'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/${lang}/blog/${featuredT?.slug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-surface-hover"
              >
                {lang === 'id' ? 'Artikel Unggulan' : 'Featured Article'}
              </Link>
            </div>
          </div>
        </section>

        {/* Featured post card */}
        {featured && featuredT && (
          <section className="mx-auto w-full max-w-7xl px-4 py-10 lg:px-6 lg:py-14">
            <span className="text-eyebrow font-semibold uppercase tracking-[0.18em] text-frsc-crimson-500">
              {lang === 'id' ? 'Sorotan' : 'Featured'}
            </span>
            <h2 className="mt-3 max-w-3xl text-2xl font-heading font-bold leading-tight text-foreground">
              {featuredT.title}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {featuredT.excerpt}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {featured.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {featuredT.readTime} {readLabel}
              </span>
              <span>{authorName}</span>
            </div>
            <Link
              href={`/${lang}/blog/${featuredT.slug}`}
              className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-frsc-crimson-500 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-frsc-crimson-600"
            >
              {lang === 'id' ? 'Baca Artikel' : 'Read Article'}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href={`/${lang}/blog/${featuredT.slug}`}
              className="group mt-8 block overflow-hidden rounded-2xl border border-border bg-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.image}
                alt={featured.imageAlt}
                className="aspect-[21/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </Link>
          </section>
        )}

        {/* Latest grid */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-24 pt-16 lg:px-6 lg:pt-20">
          <div className="mb-8">
            <h2 className="text-h2 font-heading font-bold text-foreground">{latestLabel}</h2>
          </div>
          <BlogHomeGrid posts={posts} lang={lang} />
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <SiteFooter />
      <ScrollReveal />
    </div>
  )
}
