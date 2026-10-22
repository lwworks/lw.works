import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { calendarSyncState, type CalendarSyncState } from '@/lib/db/schema/time-tracking'
import { eq } from 'drizzle-orm'

/** Records a finished run and releases the lock. */
export const updateCalendarSyncState = (stateId: string, values: Partial<Pick<CalendarSyncState, 'status' | 'lastError' | 'lastSyncedAt'>>) =>
  getDb()
    .update(calendarSyncState)
    .set({ ...values, lockedUntil: null })
    .where(eq(calendarSyncState.id, stateId))
