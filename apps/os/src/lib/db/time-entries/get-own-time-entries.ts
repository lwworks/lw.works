import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { timeEntry } from '@/lib/db/schema/time-tracking'
import { and, asc, eq, gte, isNull, lt, sql } from 'drizzle-orm'

export type TimeEntryDTO = Awaited<ReturnType<typeof getOwnTimeEntries>>[number]

/** The signed-in user's non-deleted entries starting in `[start, end)`. */
export const getOwnTimeEntries = async ({ start, end }: { start: Date; end: Date }) => {
  const userId = await requireUserId()
  return getDb()
    .select({
      id: timeEntry.id,
      title: timeEntry.title,
      description: timeEntry.description,
      location: timeEntry.location,
      attendeeCount: sql<number>`jsonb_array_length(${timeEntry.attendees})`.mapWith(Number),
      startAt: timeEntry.startAt,
      endAt: timeEntry.endAt,
      htmlLink: timeEntry.htmlLink,
    })
    .from(timeEntry)
    .where(and(eq(timeEntry.userId, userId), isNull(timeEntry.deletedAt), gte(timeEntry.startAt, start), lt(timeEntry.startAt, end)))
    .orderBy(asc(timeEntry.startAt))
}
