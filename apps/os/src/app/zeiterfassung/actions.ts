'use server'

import { getSession } from '@/lib/auth/get-session'
import { syncCalendarForUser } from '@/lib/google-calendar/sync-calendar-for-user'
import type { SyncResult } from '@/lib/google-calendar/sync-calendar-state'
import { parseSyncRange } from '@/lib/time-tracking/parse-sync-range'
import { refresh } from 'next/cache'
import { redirect } from 'next/navigation'

/** Re-syncs the signed-in user's calendar for the picked days (`YYYY-MM-DD`, inclusive). */
export async function syncOwnCalendar(days: { from: string; to: string }): Promise<SyncResult | { status: 'invalid_range' }> {
  const session = await getSession()
  if (!session) redirect('/login')

  const range = parseSyncRange(days, new Date())
  if (!range) return { status: 'invalid_range' }

  const result = await syncCalendarForUser(session.user.id, range)
  refresh()
  return result
}
