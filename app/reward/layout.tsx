import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const titles = { id: 'Reward — Farisium', en: 'Reward — Farisium' }
  const descriptions = {
    id: 'Klaim +1 FRSC gratis dengan mengunjungi sponsor Farisium.',
    en: 'Claim +1 FRSC free by visiting Farisium sponsor.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/reward')
  const alternates = getHreflangLinks('/reward', lang)
  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: { canonical: canonicalUrl, languages: Object.fromEntries(alternates.map(a => [a.lang, a.href])) },
    robots: { index: false, follow: false },
  }
}

export default function RewardLayout({ children }: { children: React.ReactNode }) {
  return children
}
