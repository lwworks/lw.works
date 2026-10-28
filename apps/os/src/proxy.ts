import { getSessionCookie } from 'better-auth/cookies'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Optimistic check only (cookie present, no DB lookup): pages stream, so their own `getSession` redirect can't send a
 * 307 anymore. Pages still verify the session; this just sends visitors without a cookie to the login page directly.
 */
export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: ['/((?!login|api|_next/|favicon/|images/|robots.txt).*)'],
}
