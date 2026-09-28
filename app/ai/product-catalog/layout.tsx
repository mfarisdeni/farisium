import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const titles = {
    id: 'Product Catalog AI Agent — Screenshot Katalog ke Excel & PDF | Farisium',
    en: 'Product Catalog AI Agent — Catalog Screenshots to Excel & PDF | Farisium',
  }
  const descriptions = {
    id: 'Upload screenshot katalog marketplace atau foto halaman produk, AI membaca setiap kartu produk beserta nama toko dan harganya, lalu kamu periksa dan export ke Excel atau PDF. Gambar dihapus otomatis setelah diproses.',
    en: 'Upload marketplace catalog screenshots or product page photos, AI reads every product card together with its shop name and price, then you review and export to Excel or PDF. Images are deleted automatically after processing.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/ai/product-catalog')
  const alternates = getHreflangLinks('/ai/product-catalog', lang)

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(alternates.map((a) => [a.lang, a.href])),
    },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: canonicalUrl,
      siteName: 'Farisium',
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Product Catalog AI Agent Farisium',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
  }
}

export default function ProductCatalogLayout({ children }: { children: React.ReactNode }) {
  return children
}
