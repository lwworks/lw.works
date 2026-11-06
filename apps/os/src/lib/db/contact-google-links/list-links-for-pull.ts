import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { contactGoogleLink } from '@/lib/db/schema/crm'

export const listLinksForPull = async () =>
  getDb()
    .select({
      contactId: contactGoogleLink.contactId,
      userId: contactGoogleLink.userId,
      accountId: contactGoogleLink.accountId,
      googleResourceName: contactGoogleLink.googleResourceName,
    })
    .from(contactGoogleLink)
