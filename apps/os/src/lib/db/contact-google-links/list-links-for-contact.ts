import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { contactGoogleLink } from '@/lib/db/schema/crm'
import { eq } from 'drizzle-orm'

export const listLinksForContact = async (contactId: string) =>
  getDb()
    .select({
      accountId: contactGoogleLink.accountId,
      userId: contactGoogleLink.userId,
      googleResourceName: contactGoogleLink.googleResourceName,
      etag: contactGoogleLink.etag,
      status: contactGoogleLink.status,
      lastPushedAt: contactGoogleLink.lastPushedAt,
    })
    .from(contactGoogleLink)
    .where(eq(contactGoogleLink.contactId, contactId))
