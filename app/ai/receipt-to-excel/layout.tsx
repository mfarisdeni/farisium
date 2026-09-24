import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const titles = {
    id: 'Struk Belanja ke Excel — Farisium',
    en: 'Image Receipt to Excel — Farisium',
  }
  const descriptions = {
    id: 'Konversi foto struk belanja ke file Excel otomatis — rapi, cepat, dan akurat.',
    en: 'Turn a shopping receipt photo into a clean Excel file automatically. Free, fast, and accurate.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/ai/receipt-to-excel')
  const alternates = getHreflangLinks('/ai/receipt-to-excel', lang)
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
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Image Receipt to Excel Farisium' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
  }
}

export default function ReceiptToExcelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}