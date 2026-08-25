import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const titles = { id: 'Syarat & Ketentuan — Farisium', en: 'Terms of Service — Farisium' }
  const descriptions = {
    id: 'Syarat & Ketentuan penggunaan platform Farisium. Baca ketentuan layanan, hak pengguna, kewajiban, dan kebijakan terkait sebelum menggunakan layanan AI kami.',
    en: 'Farisium Terms of Service. Read the terms of service, user rights, obligations, and related policies before using our AI services.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/terms')
  const alternates = getHreflangLinks('/terms', lang)
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
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Syarat & Ketentuan Farisium' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
  }
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
