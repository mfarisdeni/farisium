import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const titles = { id: 'Kompetisi — Farisium', en: 'Competition — Farisium' }
  const descriptions = {
    id: 'Ikuti kompetisi kreator AI Farisium, menangkan hadiah FRSC, dan tunjukkan kreativitasmu dalam membuat karya AI terbaik.',
    en: 'Join Farisium AI creator competitions, win FRSC prizes, and showcase your creativity in creating the best AI artwork.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/competition')
  const alternates = getHreflangLinks('/competition', lang)
  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: { canonical: canonicalUrl, languages: Object.fromEntries(alternates.map(a => [a.lang, a.href])) },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: canonicalUrl,
      siteName: 'Farisium',
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Kompetisi Farisium' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
  }
}

export default function CompetitionLayout({ children }: { children: React.ReactNode }) {
  return children
}
