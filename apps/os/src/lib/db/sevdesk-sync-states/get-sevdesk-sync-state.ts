import 'server-only'

import { requireAdmin } from '@/lib/auth/require-admin'
import { getDb } from '@/lib/db/get-db'
import { SEVDESK_SYNC_STATE_ID } from '@/lib/db/sevdesk-sync-states/sevdesk-sync-state-id'
import { sevdeskSyncState } from '@/lib/db/schema/finance'
import { eq } from 'drizzle-orm'

/** Last SevDesk sync time and error; null before the first run. */
export const getSevdeskSyncState = async () => {
  await requireAdmin()
  const [row] = await getDb()
    .select({ lastSyncedAt: sevdeskSyncState.lastSyncedAt, lastError: sevdeskSyncState.lastError })
    .from(sevdeskSyncState)
    .where(eq(sevdeskSyncState.id, SEVDESK_SYNC_STATE_ID))
  return row ?? null
}
