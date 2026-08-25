import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const titles = { id: 'SEO Caption Generator — Farisium', en: 'SEO Caption Generator — Farisium' }
  const descriptions = {
    id: 'Buat caption produk, deskripsi marketplace, dan konten social media yang dioptimalkan untuk SEO dengan AI. Dukung Shopee, Tokopedia, Instagram, TikTok, dan lainnya.',
    en: 'Create SEO-optimized product captions, marketplace descriptions, and social media content with AI. Supports Shopee, Tokopedia, Instagram, TikTok, and more.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/ai/seo-caption-generator')
  const alternates = getHreflangLinks('/ai/seo-caption-generator', lang)
  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: { canonical: canonicalUrl, languages: Object.fromEntries(alternates.map(a => [a.lang, a.href])) },
    robots: { index: false, follow: false },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: canonicalUrl,
      siteName: 'Farisium',
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SEO Caption Generator Farisium' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
  }
}

export default function SEOCaptionGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
