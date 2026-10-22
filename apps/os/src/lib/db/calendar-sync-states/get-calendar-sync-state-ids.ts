import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { calendarSyncState } from '@/lib/db/schema/time-tracking'
import { eq, sql } from 'drizzle-orm'

/** Sync state IDs, least recently synced first; only `userId`'s when given. */
export const getCalendarSyncStateIds = async (userId?: string) => {
  const rows = await getDb()
    .select({ id: calendarSyncState.id })
    .from(calendarSyncState)
    .where(userId ? eq(calendarSyncState.userId, userId) : undefined)
    .orderBy(sql`${calendarSyncState.lastSyncedAt} asc nulls first`)
  return rows.map((row) => row.id)
}
