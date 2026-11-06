import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { contactGoogleLink, type ContactGoogleLinkStatus } from '@/lib/db/schema/crm'

export type ContactGoogleLinkWrite = {
  contactId: string
  userId: string
  accountId: string
  googleResourceName: string | null
  etag: string | null
  status: ContactGoogleLinkStatus
  lastError: string | null
  lastPushedAt: Date | null
}

export const upsertContactGoogleLink = async (values: ContactGoogleLinkWrite) => {
  await getDb()
    .insert(contactGoogleLink)
    .values({ id: crypto.randomUUID(), ...values })
    .onConflictDoUpdate({
      target: [contactGoogleLink.contactId, contactGoogleLink.accountId],
      set: {
        userId: values.userId,
        googleResourceName: values.googleResourceName,
        etag: values.etag,
        status: values.status,
        lastError: values.lastError,
        lastPushedAt: values.lastPushedAt,
        updatedAt: new Date(),
      },
    })
}
