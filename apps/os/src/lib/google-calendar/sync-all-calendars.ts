import 'server-only'

import { ensureCalendarSyncStates } from '@/lib/db/calendar-sync-states/ensure-calendar-sync-states'
import { getCalendarSyncStateIds } from '@/lib/db/calendar-sync-states/get-calendar-sync-state-ids'
import { syncCalendarState } from '@/lib/google-calendar/sync-calendar-state'

/**
 * Syncs every calendar, least recently synced first, until `deadline`. Calendars that need the user to
 * reconnect are retried too, so a transient token failure heals on the next run.
 */
export const syncAllCalendars = async (deadline: Date) => {
  await ensureCalendarSyncStates()
  const stateIds = await getCalendarSyncStateIds()

  const summary = { total: stateIds.length, synced: 0, skipped: 0, failed: 0 }
  for (const id of stateIds) {
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
