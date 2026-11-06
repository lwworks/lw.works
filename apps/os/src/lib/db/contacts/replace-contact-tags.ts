import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { contactTag } from '@/lib/db/schema/crm'
import { eq } from 'drizzle-orm'

export const replaceContactTags = async (contactId: string, tagIds: readonly string[]) => {
  await requireUserId()
  await getDb().delete(contactTag).where(eq(contactTag.contactId, contactId))
  if (tagIds.length === 0) return
  await getDb()
    .insert(contactTag)
    .values(tagIds.map((tagId) => ({ contactId, tagId })))
}
