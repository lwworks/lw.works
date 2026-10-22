import 'server-only'

import { lockCalendarSyncState } from '@/lib/db/calendar-sync-states/lock-calendar-sync-state'
import { updateCalendarSyncState } from '@/lib/db/calendar-sync-states/update-calendar-sync-state'
import { timeEntry, type CalendarSyncStatus } from '@/lib/db/schema/time-tracking'
import { softDeleteTimeEntries } from '@/lib/db/time-entries/soft-delete-time-entries'
import { upsertTimeEntries } from '@/lib/db/time-entries/upsert-time-entries'
import { getAccessToken, ReauthRequiredError } from '@/lib/google-calendar/get-access-token'
import { GoogleCalendarError } from '@/lib/google-calendar/google-calendar-error'
import { listEvents } from '@/lib/google-calendar/list-events'
import { SYNC_START, toTimeEntryValues } from '@/lib/google-calendar/to-time-entry-values'
import { and, gte, lt } from 'drizzle-orm'
import { DrizzleQueryError } from 'drizzle-orm/errors'

const DEFAULT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000

export type SyncRange = { from: Date; to: Date }

export type SyncResult = { status: CalendarSyncStatus | 'locked' }

const failureStatus = (error: unknown): CalendarSyncStatus => {
  if (error instanceof ReauthRequiredError) return 'reauth_required'
  if (error instanceof GoogleCalendarError && error.status === 401) return 'reauth_required'
  if (error instanceof GoogleCalendarError && error.isMissingScope) return 'missing_scope'
  return 'error'
}

/**
 * Re-syncs every event starting in `range`: upserts qualifying events (restoring soft-deleted ones) and
 * soft-deletes entries in the range that Google no longer returns or that no longer qualify.
 * Default range: the last 7 days, or everything since SYNC_START until the first successful sync.
 */
export const syncCalendarState = async (stateId: string, range?: SyncRange): Promise<SyncResult> => {
  const state = await lockCalendarSyncState(stateId)
  if (!state) return { status: 'locked' }

  const runStartedAt = new Date()
  const { from, to } = range ?? {
    from: state.lastSyncedAt ? new Date(runStartedAt.getTime() - DEFAULT_WINDOW_MS) : SYNC_START,
    to: runStartedAt,
  }

  try {
    await listEvents(
      (forceRefresh) => getAccessToken(state, forceRefresh),
      state.calendarId,
      { timeMin: from, timeMax: to },
      (events) => upsertTimeEntries(state, events.flatMap((event) => toTimeEntryValues(event, runStartedAt) ?? []), runStartedAt),
    )
    await softDeleteTimeEntries(state, and(gte(timeEntry.startAt, from), lt(timeEntry.startAt, to), lt(timeEntry.lastSeenAt, runStartedAt)))
    await updateCalendarSyncState(state.id, { status: 'ok', lastError: null, lastSyncedAt: new Date() })
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
