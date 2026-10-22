import 'server-only'

import { getDb } from '@/db'
import { account } from '@/db/auth-schema'
import { calendarSyncState, timeEntry, type CalendarSyncStatus } from '@/db/time-tracking-schema'
import { auth } from '@/lib/auth'
import { and, eq, inArray, isNull, lt, or, sql, type SQL } from 'drizzle-orm'
import { DrizzleQueryError } from 'drizzle-orm/errors'
import { GoogleCalendarError, listEvents, type GoogleEvent, type ListEventsParams } from './client'
import { SYNC_START, toTimeEntryValues, type TimeEntryValues } from './map-event'

const CALENDAR_ID = 'primary'
const LOCK_MS = 5 * 60 * 1000
const FULL_SYNC_INTERVAL_MS = 24 * 60 * 60 * 1000
// Re-fetching a little before the cursor absorbs clock skew; reprocessing events is idempotent.
const OVERLAP_MS = 2 * 60 * 1000
const UPSERT_CHUNK_SIZE = 100

type SyncState = typeof calendarSyncState.$inferSelect

export type SyncResult = { status: CalendarSyncStatus | 'locked' }

class ReauthRequiredError extends Error {}

const excluded = (column: string) => sql.raw(`excluded."${column}"`)

const upsertEntries = async (state: SyncState, values: TimeEntryValues[], seenAt: Date) => {
  for (let i = 0; i < values.length; i += UPSERT_CHUNK_SIZE) {
    const rows = values.slice(i, i + UPSERT_CHUNK_SIZE).map((value) => ({
      ...value,
      id: crypto.randomUUID(),
      userId: state.userId,
      calendarId: state.calendarId,
      lastSeenAt: seenAt,
      deletedAt: null,
    }))
    await getDb()
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
        // Never let an older copy of an event (e.g. from an overlapping run) overwrite a newer one.
        setWhere: sql.raw('"time_entry"."google_updated_at" <= excluded."google_updated_at"'),
      })
  }
}

const softDeleteEntries = (state: SyncState, condition: SQL | undefined) =>
  getDb()
    .update(timeEntry)
    .set({ deletedAt: sql`now()` })
    .where(and(eq(timeEntry.userId, state.userId), eq(timeEntry.calendarId, state.calendarId), isNull(timeEntry.deletedAt), condition))

const applyEvents = async (state: SyncState, events: GoogleEvent[], runStartedAt: Date) => {
  const tracked: TimeEntryValues[] = []
  const untrackedIds: string[] = []
  for (const event of events) {
    const values = toTimeEntryValues(event, runStartedAt)
    if (values) tracked.push(values)
    else untrackedIds.push(event.id)
  }

  await upsertEntries(state, tracked, runStartedAt)
  if (untrackedIds.length === 0) return
  // A cancelled recurring series arrives as its master event, whose ID is the instances' recurring event ID.
  await softDeleteEntries(state, or(inArray(timeEntry.googleEventId, untrackedIds), inArray(timeEntry.googleRecurringEventId, untrackedIds)))
}

const createTokenGetter = ({ accountId, userId }: SyncState) => async (forceRefresh: boolean) => {
  const body = { accountId, userId }
  const tokens = await (forceRefresh ? auth.api.refreshToken({ body }) : auth.api.getAccessToken({ body })).catch(() => null)
  if (!tokens?.accessToken) throw new ReauthRequiredError('Google access token unavailable')
  return tokens.accessToken
}

const acquireLock = async (stateId: string) => {
  const [state] = await getDb()
    .update(calendarSyncState)
    .set({ lockedUntil: new Date(Date.now() + LOCK_MS) })
    .where(and(eq(calendarSyncState.id, stateId), or(isNull(calendarSyncState.lockedUntil), lt(calendarSyncState.lockedUntil, sql`now()`))))
    .returning()
  return state
}

const failureStatus = (error: unknown): CalendarSyncStatus => {
  if (error instanceof ReauthRequiredError) return 'reauth_required'
  if (error instanceof GoogleCalendarError && error.status === 401) return 'reauth_required'
  if (error instanceof GoogleCalendarError && error.isMissingScope) return 'missing_scope'
  return 'error'
}

/**
 * Full sync: everything from SYNC_START, then soft-delete rows that weren't seen.
 * Incremental: changed events (including deleted ones and ones moved into the future), then events
 * whose start passed since the last run. A 410 from Google means `updatedMin` is too old → full sync.
 */
export const syncCalendarState = async (stateId: string): Promise<SyncResult> => {
  const state = await acquireLock(stateId)
  if (!state) return { status: 'locked' }

  const runStartedAt = new Date()
  const getAccessToken = createTokenGetter(state)
  const fetchAndApply = (params: ListEventsParams) =>
    listEvents(getAccessToken, state.calendarId, params, (events) => applyEvents(state, events, runStartedAt))

  const syncIncrementally = async (syncedUntil: Date) => {
    const since = new Date(syncedUntil.getTime() - OVERLAP_MS)
    try {
      await fetchAndApply({ updatedMin: since, timeMin: SYNC_START, showDeleted: true })
      await fetchAndApply({ timeMin: since, timeMax: runStartedAt })
      return true
    } catch (error) {
      if (error instanceof GoogleCalendarError && error.status === 410) return false
      throw error
    }
  }

  try {
    const { syncedUntil, lastFullSyncAt } = state
    const fullSyncDue = !syncedUntil || !lastFullSyncAt || runStartedAt.getTime() - lastFullSyncAt.getTime() > FULL_SYNC_INTERVAL_MS
    const fullSync = fullSyncDue || !(await syncIncrementally(syncedUntil))
    if (fullSync) {
      await fetchAndApply({ timeMin: SYNC_START, timeMax: runStartedAt })
      await softDeleteEntries(state, lt(timeEntry.lastSeenAt, runStartedAt))
    }

    await getDb()
      .update(calendarSyncState)
      .set({
        status: 'ok',
        lastError: null,
        syncedUntil: runStartedAt,
        lastFullSyncAt: fullSync ? runStartedAt : lastFullSyncAt,
        lastSyncedAt: new Date(),
        lockedUntil: null,
      })
      .where(eq(calendarSyncState.id, state.id))
    return { status: 'ok' }
  } catch (error) {
    const status = failureStatus(error)
    // Drizzle query errors embed the query params (event titles, attendees); keep those out of the DB and logs.
    const cause = error instanceof DrizzleQueryError ? error.cause : error
    if (status === 'error') console.error(`Calendar sync failed for state ${state.id}:`, cause)
    await getDb()
      .update(calendarSyncState)
      .set({ status, lastError: String(cause).slice(0, 500), lockedUntil: null })
      .where(eq(calendarSyncState.id, state.id))
    return { status }
  }
}

const ensureSyncStates = async (userId?: string) => {
  const googleAccounts = await getDb()
    .select({ id: account.id, userId: account.userId })
    .from(account)
    .where(and(eq(account.providerId, 'google'), userId ? eq(account.userId, userId) : undefined))
  if (googleAccounts.length === 0) return

  await getDb()
    .insert(calendarSyncState)
    .values(googleAccounts.map(({ id, userId }) => ({ id: crypto.randomUUID(), userId, accountId: id, calendarId: CALENDAR_ID })))
    .onConflictDoNothing({ target: [calendarSyncState.userId, calendarSyncState.calendarId] })
}

export const syncCalendarForUser = async (userId: string): Promise<SyncResult> => {
  await ensureSyncStates(userId)
  const [state] = await getDb()
    .select({ id: calendarSyncState.id })
    .from(calendarSyncState)
    .where(and(eq(calendarSyncState.userId, userId), eq(calendarSyncState.calendarId, CALENDAR_ID)))
  return state ? syncCalendarState(state.id) : { status: 'reauth_required' }
}

/**
 * Syncs every calendar, least recently synced first, until `deadline`. Calendars that need the user to
 * reconnect are retried too, so a transient token failure heals on the next run.
 */
export const syncAllCalendars = async (deadline: Date) => {
  await ensureSyncStates()
  const states = await getDb()
    .select({ id: calendarSyncState.id })
    .from(calendarSyncState)
    .orderBy(sql`${calendarSyncState.lastSyncedAt} asc nulls first`)

  const summary = { total: states.length, synced: 0, skipped: 0, failed: 0 }
  for (const { id } of states) {
    if (new Date() >= deadline) {
      summary.skipped++
      continue
    }
    try {
      const { status } = await syncCalendarState(id)
      if (status === 'ok') summary.synced++
      else if (status === 'locked') summary.skipped++
      else summary.failed++
    } catch (error) {
      summary.failed++
      console.error(`Calendar sync failed for state ${id}:`, error)
    }
  }
  return summary
}
