import 'server-only'

import { getDb } from '@/db'
import { account } from '@/db/auth-schema'
import { calendarSyncState, timeEntry, type CalendarSyncStatus } from '@/db/time-tracking-schema'
import { auth } from '@/lib/auth'
import { and, asc, eq, inArray, isNull, lt, or, sql } from 'drizzle-orm'
import { GoogleCalendarError, listEvents, type GoogleEvent, type ListEventsParams } from './client'
import { SYNC_START, toTimeEntryValues, type TimeEntryValues } from './map-event'

const CALENDAR_ID = 'primary'
const LOCK_DURATION_MS = 5 * 60 * 1000
const FULL_SYNC_INTERVAL_MS = 24 * 60 * 60 * 1000
const CURSOR_OVERLAP_MS = 2 * 60 * 1000
const UPSERT_CHUNK_SIZE = 100

type SyncState = typeof calendarSyncState.$inferSelect

export type SyncResult = { status: CalendarSyncStatus | 'locked' }

class ReauthRequiredError extends Error {}

const excluded = (column: string) => sql.raw(`excluded."${column}"`)

const upsertEntries = async (state: SyncState, values: TimeEntryValues[], seenAt: Date) => {
  const db = getDb()
  for (let i = 0; i < values.length; i += UPSERT_CHUNK_SIZE) {
    const rows = values.slice(i, i + UPSERT_CHUNK_SIZE).map((value) => ({
      ...value,
      id: crypto.randomUUID(),
      userId: state.userId,
      calendarId: state.calendarId,
      lastSeenAt: seenAt,
      deletedAt: null,
    }))
    await db
      .insert(timeEntry)
      .values(rows)
      .onConflictDoUpdate({
        target: [timeEntry.userId, timeEntry.calendarId, timeEntry.googleEventId],
        set: {
          googleRecurringEventId: excluded('google_recurring_event_id'),
          googleICalUid: excluded('google_ical_uid'),
          title: excluded('title'),
          description: excluded('description'),
          location: excluded('location'),
          attendees: excluded('attendees'),
          startAt: excluded('start_at'),
          endAt: excluded('end_at'),
          timeZone: excluded('time_zone'),
          htmlLink: excluded('html_link'),
          googleStatus: excluded('google_status'),
          googleUpdatedAt: excluded('google_updated_at'),
          lastSeenAt: excluded('last_seen_at'),
          deletedAt: sql`null`,
          updatedAt: sql`now()`,
        },
        setWhere: sql.raw('"time_entry"."google_updated_at" <= excluded."google_updated_at"'),
      })
  }
}

const softDeleteEntries = async (state: SyncState, eventIds: string[], { includeSeries }: { includeSeries: boolean }) => {
  if (eventIds.length === 0) return
  const matchesEvent = includeSeries
    ? or(inArray(timeEntry.googleEventId, eventIds), inArray(timeEntry.googleRecurringEventId, eventIds))
    : inArray(timeEntry.googleEventId, eventIds)
  await getDb()
    .update(timeEntry)
    .set({ deletedAt: sql`now()` })
    .where(and(eq(timeEntry.userId, state.userId), eq(timeEntry.calendarId, state.calendarId), isNull(timeEntry.deletedAt), matchesEvent))
}

const processPage = async (state: SyncState, events: GoogleEvent[], runStartedAt: Date) => {
  const upserts: TimeEntryValues[] = []
  const cancelledIds: string[] = []
  const untrackedIds: string[] = []

  for (const event of events) {
    if (event.status === 'cancelled') {
      cancelledIds.push(event.id)
      continue
    }
    const values = toTimeEntryValues(event, runStartedAt)
    if (values) upserts.push(values)
    else untrackedIds.push(event.id)
  }

  await upsertEntries(state, upserts, runStartedAt)
  await softDeleteEntries(state, cancelledIds, { includeSeries: true })
  await softDeleteEntries(state, untrackedIds, { includeSeries: false })
}

const runFullReconciliation = async (state: SyncState, getAccessToken: (force: boolean) => Promise<string>, runStartedAt: Date) => {
  await listEvents(getAccessToken, state.calendarId, { timeMin: SYNC_START, timeMax: runStartedAt }, (events) =>
    processPage(state, events, runStartedAt),
  )
  await getDb()
    .update(timeEntry)
    .set({ deletedAt: sql`now()` })
    .where(
      and(
        eq(timeEntry.userId, state.userId),
        eq(timeEntry.calendarId, state.calendarId),
        isNull(timeEntry.deletedAt),
        lt(timeEntry.lastSeenAt, runStartedAt),
      ),
    )
  return { windowEnd: runStartedAt, changesCheckedAt: runStartedAt, lastFullSyncAt: runStartedAt }
}

const runIncremental = async (
  state: SyncState,
  cursors: { windowEnd: Date; changesCheckedAt: Date },
  getAccessToken: (force: boolean) => Promise<string>,
  runStartedAt: Date,
) => {
  const requests: ListEventsParams[] = [
    { updatedMin: new Date(cursors.changesCheckedAt.getTime() - CURSOR_OVERLAP_MS), timeMin: SYNC_START, showDeleted: true },
    { timeMin: new Date(cursors.windowEnd.getTime() - CURSOR_OVERLAP_MS), timeMax: runStartedAt },
  ]
  for (const params of requests) {
    await listEvents(getAccessToken, state.calendarId, params, (events) => processPage(state, events, runStartedAt))
  }
  return { windowEnd: runStartedAt, changesCheckedAt: runStartedAt }
}

const acquireLock = async (stateId: string) => {
  const [state] = await getDb()
    .update(calendarSyncState)
    .set({ lockedUntil: new Date(Date.now() + LOCK_DURATION_MS) })
    .where(and(eq(calendarSyncState.id, stateId), or(isNull(calendarSyncState.lockedUntil), lt(calendarSyncState.lockedUntil, sql`now()`))))
    .returning()
  return state
}

const createTokenGetter = (state: SyncState) => async (forceRefresh: boolean) => {
  const body = { accountId: state.accountId, userId: state.userId }
  try {
    const tokens = forceRefresh ? await auth.api.refreshToken({ body }) : await auth.api.getAccessToken({ body })
    if (!tokens.accessToken) throw new ReauthRequiredError()
    return tokens.accessToken
  } catch {
    throw new ReauthRequiredError()
  }
}

const toFailure = (error: unknown): { status: CalendarSyncStatus; lastError: string } => {
  if (error instanceof ReauthRequiredError) return { status: 'reauth_required', lastError: 'Google-Zugriff abgelaufen oder widerrufen.' }
  if (error instanceof GoogleCalendarError) {
    if (error.status === 401) return { status: 'reauth_required', lastError: 'Google-Zugriff abgelaufen oder widerrufen.' }
    if (error.isMissingScope) return { status: 'missing_scope', lastError: 'Kalenderberechtigung fehlt.' }
    return { status: 'error', lastError: `Google Calendar API ${error.status}: ${error.message}`.slice(0, 500) }
  }
  return { status: 'error', lastError: (error instanceof Error ? error.message : String(error)).slice(0, 500) }
}

export const syncCalendarState = async (stateId: string): Promise<SyncResult> => {
  const state = await acquireLock(stateId)
  if (!state) return { status: 'locked' }

  const db = getDb()
  const runStartedAt = new Date()
  const getAccessToken = createTokenGetter(state)

  try {
    const { windowEnd, changesCheckedAt, lastFullSyncAt } = state
    const fullSyncDue = !lastFullSyncAt || runStartedAt.getTime() - lastFullSyncAt.getTime() > FULL_SYNC_INTERVAL_MS
    let cursors
    if (!windowEnd || !changesCheckedAt || fullSyncDue) {
      cursors = await runFullReconciliation(state, getAccessToken, runStartedAt)
    } else {
      try {
        cursors = await runIncremental(state, { windowEnd, changesCheckedAt }, getAccessToken, runStartedAt)
      } catch (error) {
        if (!(error instanceof GoogleCalendarError && error.status === 410)) throw error
        cursors = await runFullReconciliation(state, getAccessToken, runStartedAt)
      }
    }

    await db
      .update(calendarSyncState)
      .set({ ...cursors, status: 'ok', lastError: null, lastSyncedAt: new Date(), lockedUntil: null })
      .where(eq(calendarSyncState.id, state.id))
    return { status: 'ok' }
  } catch (error) {
    const failure = toFailure(error)
    if (failure.status === 'error') console.error(`Calendar sync failed for state ${state.id}:`, failure.lastError)
    await db
      .update(calendarSyncState)
      .set({ ...failure, lockedUntil: null })
      .where(eq(calendarSyncState.id, state.id))
    return { status: failure.status }
  }
}

const ensureSyncStates = async (userId?: string) => {
  const db = getDb()
  const googleAccounts = await db
    .select({ id: account.id, userId: account.userId })
    .from(account)
    .where(and(eq(account.providerId, 'google'), userId ? eq(account.userId, userId) : undefined))
  if (googleAccounts.length === 0) return

  await db
    .insert(calendarSyncState)
    .values(googleAccounts.map((googleAccount) => ({
      id: crypto.randomUUID(),
      userId: googleAccount.userId,
      accountId: googleAccount.id,
      calendarId: CALENDAR_ID,
    })))
    .onConflictDoNothing({ target: [calendarSyncState.userId, calendarSyncState.calendarId] })
}

export const syncCalendarForUser = async (userId: string): Promise<SyncResult> => {
  await ensureSyncStates(userId)
  const [state] = await getDb()
    .select({ id: calendarSyncState.id })
    .from(calendarSyncState)
    .where(and(eq(calendarSyncState.userId, userId), eq(calendarSyncState.calendarId, CALENDAR_ID)))
  if (!state) return { status: 'reauth_required' }
  return syncCalendarState(state.id)
}

export const syncAllCalendars = async (deadline: Date) => {
  await ensureSyncStates()
  const states = await getDb()
    .select({
      id: calendarSyncState.id,
      status: calendarSyncState.status,
      stateUpdatedAt: calendarSyncState.updatedAt,
      accountUpdatedAt: account.updatedAt,
    })
    .from(calendarSyncState)
    .innerJoin(account, eq(account.id, calendarSyncState.accountId))
    .orderBy(sql`${calendarSyncState.lastSyncedAt} asc nulls first`, asc(calendarSyncState.createdAt))

  const summary = { total: states.length, synced: 0, skipped: 0, failed: 0 }
  for (const state of states) {
    const awaitsUserAction = state.status === 'reauth_required' || state.status === 'missing_scope'
    if (new Date() >= deadline || (awaitsUserAction && state.accountUpdatedAt <= state.stateUpdatedAt)) {
      summary.skipped++
      continue
    }
    const result = await syncCalendarState(state.id)
    if (result.status === 'ok') summary.synced++
    else if (result.status === 'locked') summary.skipped++
    else summary.failed++
  }
  return summary
}
