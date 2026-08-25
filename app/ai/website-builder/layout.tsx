import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const titles = {
    id: 'Jasa Pembuatan Website Murah Mulai Rp 20 Ribu – Farisium',
    en: 'Affordable Website Building Service from IDR 20k – Farisium',
  }
  const descriptions = {
    id: 'Jasa pembuatan website landing page untuk startup, freelancer, bisnis lokal, dan portfolio. Cukup isi form singkat, bayar pakai FRSC mulai Rp 20 ribu per halaman. Hemat hingga 80%.',
    en: 'Landing page website building service for startups, freelancers, local businesses, and portfolios. Fill a short form, pay with FRSC from IDR 20k per page. Save up to 80%.',
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    keywords: [
      'jasa pembuatan website murah',
      'jasa buat website landing page',
      'pembuatan website startup',
      'jasa website bisnis lokal',
      'jasa pembuatan portfolio online',
      'website builder murah',
      'affordable website building service',
      'landing page service',
    ],
    alternates: { canonical: getCanonicalUrl(lang, '/ai/website-builder'), languages: Object.fromEntries(getHreflangLinks('/ai/website-builder', lang).map(a => [a.lang, a.href])) },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: getCanonicalUrl(lang, '/ai/website-builder'),
      siteName: 'Farisium',
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Farisium Website Builder Service' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
  }
}

export default function WebsiteBuilderLayout({ children }: { children: React.ReactNode }) {
  return children
}
