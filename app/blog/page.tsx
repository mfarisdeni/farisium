import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ScrollReveal } from '@/components/scroll-reveal'
import { getAllPosts, generateCollectionPageSchema } from '@/lib/blog'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import { BlogFilter } from '@/components/blog/BlogFilter'
import { ArticleBreadcrumb } from '@/components/blog/ArticleBreadcrumb'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const titles = {
    id: 'Semua Artikel — Blog AI & Teknologi | Farisium',
    en: 'All Articles — AI & Technology Blog | Farisium',
  }

  const descriptions = {
    id: 'Jelajahi semua artikel blog Farisium — tutorial AI, review tools, strategi produktivitas, dan berita teknologi terkini untuk kreator dan developer.',
    en: 'Browse all Farisium articles — AI tutorials, tool reviews, productivity strategies, and the latest technology news for creators and developers.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/blog')
  const alternates = getHreflangLinks('/blog', lang)
  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: { canonical: canonicalUrl, languages: Object.fromEntries(alternates.map(a => [a.lang, a.href])) },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: canonicalUrl,
      type: 'website',
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      siteName: 'Farisium',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Farisium Blog — AI & Technology Articles' }],
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
      googleBot: { index: true, follow: true },
    },
  }
}

const posts = getAllPosts()

const labels = {
  id: {
    badge: 'Blog',
    title: 'Artikel & Tutorial',
    description: 'Pelajari cara menggunakan layanan Farisium, tips prompt engineering, dan perkembangan terbaru platform.',
    readLabel: 'baca',
    readMore: 'Baca',
    searchPlaceholder: 'Cari artikel, tutorial, atau topik AI...',
  },
  en: {
    badge: 'Blog',
    title: 'Articles & Tutorials',
    description: 'Learn how to use Farisium services, prompt engineering tips, and the latest platform updates.',
    readLabel: 'min read',
    readMore: 'Read',
    searchPlaceholder: 'Search articles, tutorials or AI topics...',
  },
}

export default async function BlogPage() {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang
  const label = labels[lang] ?? labels.id

  const breadcrumbItems = [
    { label: lang === 'id' ? 'Beranda' : 'Home', href: '/' },
    { label: 'Blog' },
  ]

  const collectionSchema = generateCollectionPageSchema(posts, lang)

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 pt-14 sm:px-6 lg:px-8 lg:pt-20">
          <ArticleBreadcrumb items={breadcrumbItems} />
        </div>
        <BlogFilter posts={posts} lang={lang} labels={label} />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <SiteFooter />
      <ScrollReveal />
    </div>
  )
}
