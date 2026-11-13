import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { contactTag, tag } from '@/lib/db/schema/crm'
import { asc, count, eq } from 'drizzle-orm'

/** All tags by name, with how many contacts use each. */
export const listTags = async () => {
  await requireUserId()
  return getDb()
    .select({ id: tag.id, name: tag.name, color: tag.color, usageCount: count(contactTag.contactId) })
    .from(tag)
    .leftJoin(contactTag, eq(contactTag.tagId, tag.id))
    .groupBy(tag.id)
    .orderBy(asc(tag.name))
}

export type TagListItem = Awaited<ReturnType<typeof listTags>>[number]
