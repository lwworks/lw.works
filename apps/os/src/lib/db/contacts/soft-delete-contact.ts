import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { visibleContactWhere } from '@/lib/db/contacts/visible-contact-where'
import { getDb } from '@/lib/db/get-db'
import { contact } from '@/lib/db/schema/crm'
import { and, eq } from 'drizzle-orm'

/** Sets `deleted_at`. The row stays so its display id is never reused. */
export const softDeleteContact = async (id: string) => {
  const userId = await requireUserId()
  const [row] = await getDb()
    .update(contact)
    .set({ deletedAt: new Date() })
    .where(and(eq(contact.id, id), visibleContactWhere(userId)))
    .returning({ id: contact.id })
  return row ?? null
}
