import 'server-only'

import { getDb } from '@/db'
import { account } from '@/db/auth-schema'
import { calendarSyncState, timeEntry, type CalendarSyncStatus } from '@/db/time-tracking-schema'
import { getSession } from '@/lib/auth'
import { GOOGLE_CALENDAR_SCOPE } from '@/lib/google-calendar/scope'
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

export type CalendarSyncDTO = {
  status: CalendarSyncStatus | 'not_connected'
  lastSyncedAt: Date | null
}

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
  const db = getDb()

  const [googleAccount] = await db
    .select({
      hasRefreshToken: sql<boolean>`${account.refreshToken} is not null`,
      scope: account.scope,
    })
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, 'google')))
  const [state] = await db
    .select({ status: calendarSyncState.status, lastSyncedAt: calendarSyncState.lastSyncedAt })
    .from(calendarSyncState)
    .where(eq(calendarSyncState.userId, userId))

  const hasCalendarAccess = Boolean(googleAccount?.hasRefreshToken && googleAccount.scope?.includes(GOOGLE_CALENDAR_SCOPE))
  if (!hasCalendarAccess && state?.status !== 'ok') return { status: 'not_connected', lastSyncedAt: state?.lastSyncedAt ?? null }
  return { status: state?.status ?? 'pending', lastSyncedAt: state?.lastSyncedAt ?? null }
}
