import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { visibleContactWhere } from '@/lib/db/contacts/visible-contact-where'
import { getDb } from '@/lib/db/get-db'
import { contact } from '@/lib/db/schema/crm'
import { note } from '@/lib/db/schema/notes'
import { and, eq, isNull, or } from 'drizzle-orm'

/**
 * A note written by the signed-in user, or null. Contact notes also require the contact to still be visible to them;
 * companies and projects are visible to every member.
 */
export const getOwnNote = async (id: string) => {
  const userId = await requireUserId()
  const [row] = await getDb()
    .select({ id: note.id, contactId: note.contactId, companyId: note.companyId, projectId: note.projectId })
    .from(note)
    .leftJoin(contact, eq(note.contactId, contact.id))
    .where(and(eq(note.id, id), eq(note.createdByUserId, userId), or(isNull(note.contactId), visibleContactWhere(userId))))
    .limit(1)
  return row ?? null
}
