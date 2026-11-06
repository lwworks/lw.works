import { GOOGLE_CONTACTS_SCOPE } from '@/lib/google-contacts-sync/scope'

/** Space-separated OAuth scope string, as better-auth stores it on the account. */
export const hasContactsScope = (scope: string | null) => (scope ?? '').split(/\s+/).includes(GOOGLE_CONTACTS_SCOPE)
