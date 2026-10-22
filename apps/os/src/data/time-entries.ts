import 'server-only'

import { getDb } from '@/db'
import { calendarSyncState, timeEntry, type CalendarSyncStatus } from '@/db/time-tracking-schema'
import { getSession } from '@/lib/auth'
import { and, asc, eq, gte, isNull, lt, sql } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export type TimeEntryDTO = {
  id: string
  title: string
  description: string | null
  location: string | null
  attendeeCount: number
  startAt: Date
  endAt: Date
  htmlLink: string | null
}

export type CalendarSyncDTO = { status: CalendarSyncStatus; lastSyncedAt: Date | null }

const requireUserId = async () => {
  const session = await getSession()
  if (!session) redirect('/login')
  return session.user.id
}

export const getOwnTimeEntries = async ({ start, end }: { start: Date; end: Date }): Promise<TimeEntryDTO[]> => {
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

export const getOwnCalendarSync = async (): Promise<CalendarSyncDTO> => {
  const userId = await requireUserId()
  const [state] = await getDb()
    .select({ status: calendarSyncState.status, lastSyncedAt: calendarSyncState.lastSyncedAt })
    .from(calendarSyncState)
    .where(eq(calendarSyncState.userId, userId))
  return state ?? { status: 'pending', lastSyncedAt: null }
}
