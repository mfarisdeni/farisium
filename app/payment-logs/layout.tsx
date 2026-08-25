import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const titles = { id: 'Payment Logs — Farisium', en: 'Payment Logs — Farisium' }
  const descriptions = {
    id: 'Riwayat pembayaran dan transaksi akun Farisium.',
    en: 'Payment logs and transaction history of Farisium account.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/payment-logs')
  const alternates = getHreflangLinks('/payment-logs', lang)
  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: { canonical: canonicalUrl, languages: Object.fromEntries(alternates.map(a => [a.lang, a.href])) },
    robots: { index: false, follow: false },
  }
}

export default function PaymentLogsLayout({ children }: { children: React.ReactNode }) {
  return children
}
