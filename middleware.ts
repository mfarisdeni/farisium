import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  locales,
  defaultLocale,
  isValidLocale,
  detectLocale,
  COOKIE_NAME,
  COOKIE_MAX_AGE,
} from '@/lib/i18n'

const PUBLIC_FILE = /\.(.*)$/

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files, API routes, and Next.js internals
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico'
  ) {
    return
  }

  // Get the first path segment
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]?.toLowerCase()

  // If the first segment is a valid locale — rewrite to root-level route
  if (isValidLocale(firstSegment)) {
    const pathWithoutLocale =
      pathname === `/${firstSegment}` ? '/' : pathname.replace(`/${firstSegment}`, '')

    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = pathWithoutLocale
    const response = NextResponse.rewrite(rewriteUrl)

    response.cookies.set(COOKIE_NAME, firstSegment, {
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
    })

    return response
  }

  // If the first segment looks like a path without locale — redirect
  const cookie = request.cookies.get(COOKIE_NAME)?.value
  const acceptLanguage = request.headers.get('accept-language')
  const locale = detectLocale(cookie, acceptLanguage)

  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|ads\\.txt|robots\\.txt).*)',
  ],
}
