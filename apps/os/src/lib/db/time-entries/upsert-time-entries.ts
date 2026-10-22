import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { timeEntry, type CalendarSyncState } from '@/lib/db/schema/time-tracking'
import type { TimeEntryValues } from '@/lib/google-calendar/to-time-entry-values'
import { sql } from 'drizzle-orm'

const CHUNK_SIZE = 100

const excluded = (column: string) => sql.raw(`excluded."${column}"`)

/** Inserts or updates entries by Google event ID, marking them seen at `seenAt` and restoring soft-deleted ones. */
export const upsertTimeEntries = async (state: CalendarSyncState, values: TimeEntryValues[], seenAt: Date) => {
  for (let i = 0; i < values.length; i += CHUNK_SIZE) {
    const rows = values.slice(i, i + CHUNK_SIZE).map((value) => ({
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
