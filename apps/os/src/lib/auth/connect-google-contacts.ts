import { GOOGLE_CONTACTS_SCOPE } from '@/lib/google-contacts-sync/scope'

/**
 * Re-consents Google with the contacts scope. On a proxied preview this signs in again, the same way calendar access does.
 */
export const connectGoogleContacts = async ({ callbackURL, proxied }: { callbackURL: string; proxied: boolean }) => {
  const { authClient } = await import('@/lib/auth/auth-client')
  const options = { provider: 'google' as const, scopes: [GOOGLE_CONTACTS_SCOPE], callbackURL }
  return proxied ? authClient.signIn.social(options) : authClient.linkSocial(options)
}
