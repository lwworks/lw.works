import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { tag } from '@/lib/db/schema/crm'
import { asc } from 'drizzle-orm'

export const listTags = async () => {
  await requireUserId()
  return getDb().select({ id: tag.id, name: tag.name, color: tag.color }).from(tag).orderBy(asc(tag.name))
}

export type TagListItem = Awaited<ReturnType<typeof listTags>>[number]
