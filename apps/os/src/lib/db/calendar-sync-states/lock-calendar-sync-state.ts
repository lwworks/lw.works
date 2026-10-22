import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { calendarSyncState } from '@/lib/db/schema/time-tracking'
import { and, eq, isNull, lt, or, sql } from 'drizzle-orm'

const LOCK_MS = 5 * 60 * 1000

/** Locks the state for 5 minutes and returns it, or `undefined` if another run holds the lock. */
export const lockCalendarSyncState = async (stateId: string) => {
  const [state] = await getDb()
    .update(calendarSyncState)
    .set({ lockedUntil: new Date(Date.now() + LOCK_MS) })
    .where(and(eq(calendarSyncState.id, stateId), or(isNull(calendarSyncState.lockedUntil), lt(calendarSyncState.lockedUntil, sql`now()`))))
    .returning()
  return state
}
