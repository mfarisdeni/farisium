import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const titles = { id: 'Masuk — Farisium', en: 'Login — Farisium' }
  const descriptions = {
    id: 'Masuk ke akun Farisium menggunakan Google untuk mengakses semua layanan AI, klaim reward, dan kelola akun.',
    en: 'Login to your Farisium account using Google to access all AI services, claim rewards, and manage your account.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/login')
  const alternates = getHreflangLinks('/login', lang)
  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: { canonical: canonicalUrl, languages: Object.fromEntries(alternates.map(a => [a.lang, a.href])) },
    robots: { index: false, follow: false },
  }
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
