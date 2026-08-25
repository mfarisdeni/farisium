import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const titles = { id: 'Klaim FRSC Gratis — Farisium', en: 'Claim Free FRSC — Farisium' }
  const descriptions = {
    id: 'Dapatkan +1 FRSC gratis setiap 24 jam. Kumpulkan FRSC dan tukarkan dengan berbagai reward menarik dari Farisium dan partner.',
    en: 'Get +1 free FRSC every 24 hours. Collect FRSC and redeem with various exciting rewards from Farisium and partners.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/claim-free-frsc')
  const alternates = getHreflangLinks('/claim-free-frsc', lang)
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
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Klaim FRSC Gratis' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
  }
}

export default function ClaimFreeFRSCLayout({ children }: { children: React.ReactNode }) {
  return children
}
