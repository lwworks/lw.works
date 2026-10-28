import { authClient } from '@/lib/auth/auth-client'
import { GOOGLE_CALENDAR_SCOPE } from '@/lib/google-calendar/scope'

/**
 * Re-consents Google with the calendar scope. better-auth's OAuth proxy only covers sign-in, so Vercel previews
 * sign in again with the extra scope (refreshing the stored tokens) instead of linking the account.
 * Decided by the browser's host rather than a build-time env var, which may not be inlined into preview builds.
 */
export const connectGoogleCalendar = ({ callbackURL }: { callbackURL: string }) => {
  const options = { provider: 'google' as const, scopes: [GOOGLE_CALENDAR_SCOPE], callbackURL }
  const isVercelPreview = window.location.hostname.endsWith('.vercel.app')
  return isVercelPreview ? authClient.signIn.social(options) : authClient.linkSocial(options)
}
