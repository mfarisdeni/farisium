import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const titles = { id: 'Rewards — Farisium', en: 'Rewards — Farisium' }
  const descriptions = {
    id: 'Klaim FRSC gratis melalui Daily Reward, Referral, Loyalty Reward, dan event resmi Farisium. Tukarkan dengan berbagai hadiah menarik.',
    en: 'Claim free FRSC through Daily Reward, Referral, Loyalty Reward, and official Farisium events. Redeem for various exciting rewards.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/rewards')
  const alternates = getHreflangLinks('/rewards', lang)
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
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Rewards Farisium' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
  }
}

export default function RewardsLayout({ children }: { children: React.ReactNode }) {
  return children
}
