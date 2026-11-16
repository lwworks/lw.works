import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { sevdeskSyncState } from '@/lib/db/schema/finance'
import { SEVDESK_SYNC_STATE_ID } from '@/lib/db/sevdesk-sync-states/sevdesk-sync-state-id'
import { and, eq, isNull, lt, or, sql } from 'drizzle-orm'

const LOCK_MS = 5 * 60 * 1000

/** Locks the SevDesk sync for 5 minutes; false if another run holds the lock. */
export const lockSevdeskSyncState = async () => {
  await getDb().insert(sevdeskSyncState).values({ id: SEVDESK_SYNC_STATE_ID }).onConflictDoNothing()
  const locked = await getDb()
    .update(sevdeskSyncState)
    .set({ lockedUntil: new Date(Date.now() + LOCK_MS) })
    .where(
      and(
        eq(sevdeskSyncState.id, SEVDESK_SYNC_STATE_ID),
        or(isNull(sevdeskSyncState.lockedUntil), lt(sevdeskSyncState.lockedUntil, sql`now()`)),
      ),
    )
    .returning({ id: sevdeskSyncState.id })
  return locked.length > 0
}
