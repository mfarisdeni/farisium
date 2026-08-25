import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const titles = { id: 'Dashboard — Farisium', en: 'Dashboard — Farisium' }
  const descriptions = {
    id: 'Dashboard akun Farisium. Lihat saldo FRSC, riwayat generate, dan akses cepat ke semua layanan AI.',
    en: 'Farisium account dashboard. View FRSC balance, generation history, and quick access to all AI services.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/dashboard')
  const alternates = getHreflangLinks('/dashboard', lang)
  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: { canonical: canonicalUrl, languages: Object.fromEntries(alternates.map(a => [a.lang, a.href])) },
    robots: { index: false, follow: false },
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
