import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const titles = { id: 'Fium Chat Assistant | Farisium AI Tools', en: 'Fium Chat Assistant | Farisium AI Tools' }
  const descriptions = {
    id: 'Chat dengan Fium, Farisium AI assistant untuk ide konten, SEO, copywriting marketplace, workflow digital, dan produktivitas.',
    en: 'Chat with Fium, Farisium AI assistant for content ideas, SEO, marketplace copywriting, digital workflow, and productivity.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/ai/fium')
  const alternates = getHreflangLinks('/ai/fium', lang)
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
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Fium Chat Assistant Farisium' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
  }
}

export default function FiumLayout({ children }: { children: React.ReactNode }) {
  return children
}
