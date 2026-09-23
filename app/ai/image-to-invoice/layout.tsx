import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const titles = {
    id: 'Foto ke Invoice | PDF & Excel — Farisium',
    en: 'Image to Invoice | PDF & Excel — Farisium',
  }
  const descriptions = {
    id: 'Foto atau unggah invoice/struk apa pun, dan AI menyusun invoice digital profesional dengan template minimalis — preview final, download PDF plain & Excel yang bisa diedit.',
    en: 'Snap or upload any invoice or bill, and AI builds a professional digital invoice with a minimalist template — final preview, plain PDF & editable Excel download.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/ai/image-to-invoice')
  const alternates = getHreflangLinks('/ai/image-to-invoice', lang)
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
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Image to Invoice Farisium' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
  }
}

export default function ImageToInvoiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}