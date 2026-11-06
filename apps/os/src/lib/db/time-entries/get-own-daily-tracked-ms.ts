import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { timeEntry } from '@/lib/db/schema/time-tracking'
import { TIME_ZONE } from '@/lib/iso-week/to-zoned-date-key'
import { and, eq, gte, isNull, lt, sql } from 'drizzle-orm'

/**
 * The signed-in user's tracked time per Europe/Berlin day (`YYYY-MM-DD`) of non-deleted entries starting in
 * `[start, end)`. Entries count on the day they start; running entries count up to `now`. Days without entries are omitted.
 */
export const getOwnDailyTrackedMs = async ({ start, end, now }: { start: Date; end: Date; now: Date }) => {
  const userId = await requireUserId()
  // Inlined, not a bind parameter: Postgres only matches the GROUP BY expression if it is textually identical.
  const day = sql<string>`to_char(${timeEntry.startAt} at time zone ${sql.raw(`'${TIME_ZONE}'`)}, 'YYYY-MM-DD')`
  const trackedSeconds = sql`greatest(0, extract(epoch from least(${timeEntry.endAt}, ${now.toISOString()}::timestamptz) - ${timeEntry.startAt}))`
  return getDb()
    .select({ date: day, ms: sql<number>`sum(${trackedSeconds}) * 1000`.mapWith(Number) })
    .from(timeEntry)
    .where(and(eq(timeEntry.userId, userId), isNull(timeEntry.deletedAt), gte(timeEntry.startAt, start), lt(timeEntry.startAt, end)))
    .groupBy(day)
}
