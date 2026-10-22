import 'server-only'

import { ensureCalendarSyncStates } from '@/lib/db/calendar-sync-states/ensure-calendar-sync-states'
import { getCalendarSyncStateIds } from '@/lib/db/calendar-sync-states/get-calendar-sync-state-ids'
import { syncCalendarState, type SyncResult } from '@/lib/google-calendar/sync-calendar-state'

export const syncCalendarForUser = async (userId: string): Promise<SyncResult> => {
  await ensureCalendarSyncStates(userId)
  const [stateId] = await getCalendarSyncStateIds(userId)
  return stateId ? syncCalendarState(stateId) : { status: 'reauth_required' }
}
