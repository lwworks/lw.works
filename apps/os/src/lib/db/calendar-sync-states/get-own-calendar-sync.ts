import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { calendarSyncState, type CalendarSyncStatus } from '@/lib/db/schema/time-tracking'
import { eq } from 'drizzle-orm'

export type CalendarSyncDTO = { status: CalendarSyncStatus; lastSyncedAt: Date | null }

export const getOwnCalendarSync = async (): Promise<CalendarSyncDTO> => {
  const userId = await requireUserId()
  const [state] = await getDb()
    .select({ status: calendarSyncState.status, lastSyncedAt: calendarSyncState.lastSyncedAt })
    .from(calendarSyncState)
    .where(eq(calendarSyncState.userId, userId))
  return state ?? { status: 'pending', lastSyncedAt: null }
}
