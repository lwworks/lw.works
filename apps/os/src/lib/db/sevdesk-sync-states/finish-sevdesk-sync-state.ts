import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { SEVDESK_SYNC_STATE_ID } from '@/lib/db/sevdesk-sync-states/sevdesk-sync-state-id'
import { sevdeskSyncState } from '@/lib/db/schema/finance'
import { eq } from 'drizzle-orm'

/** Records a finished run and releases the lock. On failure, the last successful sync time stays. */
export const finishSevdeskSyncState = (result: { syncedAt: Date } | { error: string }) =>
  getDb()
    .update(sevdeskSyncState)
    .set('error' in result ? { lastError: result.error, lockedUntil: null } : { lastSyncedAt: result.syncedAt, lastError: null, lockedUntil: null })
    .where(eq(sevdeskSyncState.id, SEVDESK_SYNC_STATE_ID))
