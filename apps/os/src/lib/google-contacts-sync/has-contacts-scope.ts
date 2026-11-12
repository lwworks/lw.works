import { GOOGLE_CONTACTS_SCOPE } from '@/lib/google-contacts-sync/scope'

/** OAuth scope string as stored on the account: better-auth joins with commas, Google itself uses spaces — accept both. */
export const hasContactsScope = (scope: string | null) => (scope ?? '').split(/[\s,]+/).includes(GOOGLE_CONTACTS_SCOPE)
