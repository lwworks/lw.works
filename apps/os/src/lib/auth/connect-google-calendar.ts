import { authClient } from '@/lib/auth/auth-client'
import { GOOGLE_CALENDAR_SCOPE } from '@/lib/google-calendar/scope'

/**
 * Re-consents Google with the calendar scope. better-auth's OAuth proxy only covers sign-in, so on proxied
 * previews (`proxiesThroughProduction()` on the server) this signs in again with the extra scope, refreshing the
 * stored tokens, instead of linking the account.
 */
export const connectGoogleCalendar = ({ callbackURL, proxied }: { callbackURL: string; proxied: boolean }) => {
  const options = { provider: 'google' as const, scopes: [GOOGLE_CALENDAR_SCOPE], callbackURL }
  return proxied ? authClient.signIn.social(options) : authClient.linkSocial(options)
}
