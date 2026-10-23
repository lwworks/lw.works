import { authClient } from '@/lib/auth/auth-client'
import { GOOGLE_CALENDAR_SCOPE } from '@/lib/google-calendar/scope'

/**
 * Re-consents Google with the calendar scope. better-auth's OAuth proxy only covers sign-in, so previews
 * sign in again with the extra scope (refreshing the stored tokens) instead of linking the account.
 */
export const connectGoogleCalendar = ({ callbackURL }: { callbackURL: string }) => {
  const options = { provider: 'google' as const, scopes: [GOOGLE_CALENDAR_SCOPE], callbackURL }
  return process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ? authClient.signIn.social(options) : authClient.linkSocial(options)
}
