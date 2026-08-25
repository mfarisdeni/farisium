import type { Lang } from '@/lib/translations'

export const locales = ['en', 'id'] as const
export const defaultLocale = 'en' as const

export type Locale = (typeof locales)[number]

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export function detectLocale(
  cookie?: string | null,
  acceptLanguage?: string | null,
): Locale {
  if (cookie && isValidLocale(cookie)) return cookie

  if (acceptLanguage) {
    const preferred = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase()
    if (preferred && isValidLocale(preferred)) return preferred
  }

  return defaultLocale
}

export function getHreflangLinks(
  path: string,
  currentLang: Locale,
  translations?: Record<Locale, string>,
): Array<{ lang: Locale; href: string }> {
  return locales.map((locale) => ({
    lang: locale,
    href: `https://farisium.com/${locale}${path}`,
  }))
}

export function getCanonicalUrl(locale: Locale, path: string): string {
  return `https://farisium.com/${locale}${path}`
}

export function getLangFromPath(pathname: string): Lang {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && isValidLocale(segments[0])) {
    return segments[0] as Lang
  }
  return defaultLocale
}

export function stripLangFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && isValidLocale(segments[0])) {
    return '/' + segments.slice(1).join('/')
  }
  return pathname
}

export function addLangToPath(pathname: string, lang: Locale): string {
  const clean = stripLangFromPath(pathname)
  return `/${lang}${clean === '/' ? '' : clean}`
}

export const COOKIE_NAME = 'wf_lang'
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function setLanguageCookie(value: string): string {
  return `${COOKIE_NAME}=${value}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`
}
