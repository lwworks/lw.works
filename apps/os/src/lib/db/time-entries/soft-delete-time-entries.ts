import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { timeEntry, type CalendarSyncState } from '@/lib/db/schema/time-tracking'
import { and, eq, isNull, sql, type SQL } from 'drizzle-orm'

/** Sets `deleted_at` on the calendar's live entries matching `condition`. Rows are never hard-deleted. */
export const softDeleteTimeEntries = (state: CalendarSyncState, condition: SQL | undefined) =>
  getDb()
    .update(timeEntry)
    .set({ deletedAt: sql`now()` })
    .where(and(eq(timeEntry.userId, state.userId), eq(timeEntry.calendarId, state.calendarId), isNull(timeEntry.deletedAt), condition))
