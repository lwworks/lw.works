'use server'

import { requireUserId } from '@/lib/auth/require-user-id'
import { syncCalendarForUser } from '@/lib/google-calendar/sync-calendar-for-user'
import type { SyncResult } from '@/lib/google-calendar/sync-calendar-state'
import { parseSyncRange } from '@/lib/time-tracking/parse-sync-range'
import { refresh } from 'next/cache'

/** Re-syncs the signed-in user's calendar for the picked days (`YYYY-MM-DD`, inclusive). */
export async function syncOwnCalendar(days: { from: string; to: string }): Promise<SyncResult | { status: 'invalid_range' }> {
  const userId = await requireUserId()

  const range = parseSyncRange(days, new Date())
  if (!range) return { status: 'invalid_range' }

  const result = await syncCalendarForUser(userId, range)
  refresh()
  return result
}
