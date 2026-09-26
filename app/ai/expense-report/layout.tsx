import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const titles = {
    id: 'AI Expense Report Generator — Struk Banyak ke Excel & PDF | Farisium',
    en: 'AI Expense Report Generator — Many Receipts to Excel & PDF | Farisium',
  }
  const descriptions = {
    id: 'Upload banyak struk sekaligus, AI mengekstrak dan mengkategorikan setiap pengeluaran, lalu kamu periksa dan export laporan ke Excel atau PDF. Foto struk dihapus otomatis setelah diproses.',
    en: 'Upload many receipts at once, AI extracts and categorizes every expense, then you review and export the report to Excel or PDF. Receipt photos are deleted automatically after processing.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/ai/expense-report')
  const alternates = getHreflangLinks('/ai/expense-report', lang)

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
          alt: 'AI Expense Report Generator Farisium',
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

export default function ExpenseReportLayout({ children }: { children: React.ReactNode }) {
  return children
}
