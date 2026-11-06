import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { contact } from '@/lib/db/schema/crm'
import { and, eq, isNull } from 'drizzle-orm'

/** Only the creator can change Privat. Does not stamp a synced-field edit. */
export const updateContactPrivacy = async (id: string, isPrivate: boolean) => {
  const userId = await requireUserId()
  const [row] = await getDb()
    .update(contact)
    .set({ isPrivate })
    .where(and(eq(contact.id, id), eq(contact.createdByUserId, userId), isNull(contact.deletedAt)))
    .returning({ id: contact.id })
  return row ?? null
}
