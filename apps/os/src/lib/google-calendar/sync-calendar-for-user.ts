import 'server-only'

import { ensureCalendarSyncStates } from '@/lib/db/calendar-sync-states/ensure-calendar-sync-states'
import { getCalendarSyncStateIds } from '@/lib/db/calendar-sync-states/get-calendar-sync-state-ids'
import { syncCalendarState, type SyncRange, type SyncResult } from '@/lib/google-calendar/sync-calendar-state'

export const syncCalendarForUser = async (userId: string, range: SyncRange): Promise<SyncResult> => {
  await ensureCalendarSyncStates(userId)
  const [stateId] = await getCalendarSyncStateIds(userId)
  return stateId ? syncCalendarState(stateId, range) : { status: 'reauth_required' }
}
