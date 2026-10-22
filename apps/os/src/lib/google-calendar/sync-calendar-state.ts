import 'server-only'

import { lockCalendarSyncState } from '@/lib/db/calendar-sync-states/lock-calendar-sync-state'
import { updateCalendarSyncState } from '@/lib/db/calendar-sync-states/update-calendar-sync-state'
import { timeEntry, type CalendarSyncState, type CalendarSyncStatus } from '@/lib/db/schema/time-tracking'
import { softDeleteTimeEntries } from '@/lib/db/time-entries/soft-delete-time-entries'
import { upsertTimeEntries } from '@/lib/db/time-entries/upsert-time-entries'
import { getAccessToken, ReauthRequiredError } from '@/lib/google-calendar/get-access-token'
import { GoogleCalendarError } from '@/lib/google-calendar/google-calendar-error'
import { listEvents, type GoogleEvent, type ListEventsParams } from '@/lib/google-calendar/list-events'
import { SYNC_START, toTimeEntryValues, type TimeEntryValues } from '@/lib/google-calendar/to-time-entry-values'
import { inArray, lt, or } from 'drizzle-orm'
import { DrizzleQueryError } from 'drizzle-orm/errors'

const FULL_SYNC_INTERVAL_MS = 24 * 60 * 60 * 1000
// Re-fetching a little before the cursor absorbs clock skew; reprocessing events is idempotent.
const OVERLAP_MS = 2 * 60 * 1000

export type SyncResult = { status: CalendarSyncStatus | 'locked' }

const applyEvents = async (state: CalendarSyncState, events: GoogleEvent[], runStartedAt: Date) => {
  const tracked: TimeEntryValues[] = []
  const untrackedIds: string[] = []
  for (const event of events) {
    const values = toTimeEntryValues(event, runStartedAt)
    if (values) tracked.push(values)
    else untrackedIds.push(event.id)
  }

  await upsertTimeEntries(state, tracked, runStartedAt)
  if (untrackedIds.length === 0) return
  // A cancelled recurring series arrives as its master event, whose ID is the instances' recurring event ID.
  await softDeleteTimeEntries(state, or(inArray(timeEntry.googleEventId, untrackedIds), inArray(timeEntry.googleRecurringEventId, untrackedIds)))
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
  const state = await lockCalendarSyncState(stateId)
  if (!state) return { status: 'locked' }

  const runStartedAt = new Date()
  const fetchAndApply = (params: ListEventsParams) =>
    listEvents((forceRefresh) => getAccessToken(state, forceRefresh), state.calendarId, params, (events) => applyEvents(state, events, runStartedAt))

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
      await softDeleteTimeEntries(state, lt(timeEntry.lastSeenAt, runStartedAt))
    }

    await updateCalendarSyncState(state.id, {
      status: 'ok',
      lastError: null,
      syncedUntil: runStartedAt,
      lastFullSyncAt: fullSync ? runStartedAt : lastFullSyncAt,
      lastSyncedAt: new Date(),
    })
    return { status: 'ok' }
  } catch (error) {
    const status = failureStatus(error)
    // Drizzle query errors embed the query params (event titles, attendees); keep those out of the DB and logs.
    const cause = error instanceof DrizzleQueryError ? error.cause : error
    if (status === 'error') console.error(`Calendar sync failed for state ${state.id}:`, cause)
    await updateCalendarSyncState(state.id, { status, lastError: String(cause).slice(0, 500) })
    return { status }
  }
}
