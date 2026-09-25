import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const titles = { id: 'F-Stream Boost Spotify Promotion — Farisium', en: 'F-Stream Boost Spotify Promotion — Farisium' }
  const descriptions = {
    id: 'Kampanye Spotify yang dikelola AI agent: lagu di-pitch ke kurator playlist dan iklan tertarget dijalankan otomatis. 1.000+ streams, 7–10 hari.',
    en: 'AI agent-run Spotify campaign: your track is pitched to playlist curators and targeted ads run automatically. 1,000+ streams, 7–10 days.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/ai/f-stream-spotify-promotion')
  const alternates = getHreflangLinks('/ai/f-stream-spotify-promotion', lang)
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
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'F-Stream Boost Spotify Promotion Farisium' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
  }
}

export default function FStreamSpotifyPromotionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
