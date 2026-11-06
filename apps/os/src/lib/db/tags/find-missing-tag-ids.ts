import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { tag } from '@/lib/db/schema/crm'
import { inArray } from 'drizzle-orm'

export const findMissingTagIds = async (tagIds: readonly string[]) => {
  if (tagIds.length === 0) return []
  const rows = await getDb().select({ id: tag.id }).from(tag).where(inArray(tag.id, [...tagIds]))
  const found = new Set(rows.map((row) => row.id))
  return tagIds.filter((id) => !found.has(id))
}
