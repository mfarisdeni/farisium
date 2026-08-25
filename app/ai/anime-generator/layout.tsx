import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const titles = { id: 'Anime Generator — Farisium', en: 'Anime Generator — Farisium' }
  const descriptions = {
    id: 'Buat gambar anime berkualitas tinggi dari deskripsi teks dengan AI generatif premium. Gratis 1x generate dengan FRSC.',
    en: 'Create high-quality anime images from text descriptions with premium generative AI. Free 1x generate with FRSC.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/ai/anime-generator')
  const alternates = getHreflangLinks('/ai/anime-generator', lang)
  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: { canonical: canonicalUrl, languages: Object.fromEntries(alternates.map(a => [a.lang, a.href])) },
    robots: { index: false, follow: false },
    icons: {
      icon: '/anime-generator-icon.png',
    },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: canonicalUrl,
      siteName: 'Farisium',
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
      images: [{ url: '/anime-generator-icon.png', width: 512, height: 512, alt: 'Anime Generator Farisium' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/anime-generator-icon.png'],
    },
  }
}

export default function AnimeGeneratorLayout({ children }: { children: React.ReactNode }) {
  return children
}
