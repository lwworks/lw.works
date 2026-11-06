import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { contactGoogleLink, type ContactGoogleLinkStatus } from '@/lib/db/schema/crm'
import { eq } from 'drizzle-orm'

/** Records reconnect (or another account-level status) on every link for that Google account. */
export const setAccountLinkStatus = async (accountId: string, status: ContactGoogleLinkStatus, lastError: string) => {
  await getDb()
    .update(contactGoogleLink)
    .set({ status, lastError: lastError.slice(0, 300) })
    .where(eq(contactGoogleLink.accountId, accountId))
}
