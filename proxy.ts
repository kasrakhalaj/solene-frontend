import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['fa', 'en'] as const
const defaultLocale = 'fa'

function getLocale(request: NextRequest): string {
  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    // Simplified negotiation: check if 'fa' or 'en' is preferred
    const preferred = acceptLanguage.split(',').map((l) => l.split(';')[0].trim().toLowerCase())
    for (const lang of preferred) {
      if (lang === 'fa' || lang.startsWith('fa-')) return 'fa'
      if (lang === 'en' || lang.startsWith('en-')) return 'en'
    }
  }
  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the pathname already has a supported locale prefix
  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameHasLocale) return NextResponse.next()

  // Redirect root to default locale
  const locale = getLocale(request)
  const redirectUrl = new URL(`/${locale}${pathname}`, request.url)
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)).*)',
  ],
}
