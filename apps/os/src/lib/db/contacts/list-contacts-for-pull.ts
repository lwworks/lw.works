import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { contact } from '@/lib/db/schema/crm'
import { isNull } from 'drizzle-orm'

/** Non-deleted contacts the daily pull may update. Soft-deleted rows are absent, so a pull cannot recreate them. */
export const listContactsForPull = async () =>
  getDb()
    .select({
      id: contact.id,
      isPrivate: contact.isPrivate,
      createdByUserId: contact.createdByUserId,
      syncedFieldsEditedAt: contact.syncedFieldsEditedAt,
      lastInboundAt: contact.lastInboundAt,
    })
    .from(contact)
    .where(isNull(contact.deletedAt))
