import {NextResponse} from 'next/server'
import {NextRequest} from 'next/server'
import {Locale, i18n} from './i18n.config'
import {match as matchLocale} from '@formatjs/intl-localematcher' //@ts-ignore
import Negotiator from 'negotiator'
import {getEquivalentPathname} from './utils/i18n/get-equivalent-pathname'

export function middleware(request: NextRequest) {
  const consent = request.cookies.get('consent')?.value
  const cookieLocale = request.cookies.get('locale')?.value
  const {pathname} = request.nextUrl
  const pathLocale = i18n.locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) ? pathname?.split('/')[1] : undefined

  if (pathLocale && !cookieLocale) {
    const response = NextResponse.next()
    if (!consent) return response
    response.cookies.set('locale', pathLocale, {maxAge: 34560000, secure: true})
    return response
  }

  if (cookieLocale && !pathLocale) {
    const equivalentPathname = getEquivalentPathname(pathname, cookieLocale as Locale)
    request.nextUrl.pathname = equivalentPathname === pathname ? `/${cookieLocale}${pathname}` : equivalentPathname
    return NextResponse.redirect(request.nextUrl)
  }

  if (!cookieLocale && !pathLocale) {
    const negotiatorHeaders: Record<string, string> = {}
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))
    let languages = new Negotiator({headers: negotiatorHeaders}).languages(i18n.locales)
    const locale = matchLocale(languages, i18n.locales, i18n.defaultLocale)
    request.nextUrl.pathname = `/${locale}${pathname}`
    const response = NextResponse.redirect(request.nextUrl)
    if (!consent) return response
    response.cookies.set('locale', locale, {maxAge: 34560000, secure: true})
    return response
  }

  if (cookieLocale !== pathLocale) {
    const segments = pathname!.split('/')
    segments[1] = cookieLocale!
    request.nextUrl.pathname = segments.join('/')
    return NextResponse.redirect(request.nextUrl)
  }

  return
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon|robots|sitemap|_next).*)']
}
