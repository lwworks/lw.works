import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { account } from '@/lib/db/schema/auth'
import { calendarSyncState } from '@/lib/db/schema/time-tracking'
import { and, eq } from 'drizzle-orm'

const PRIMARY_CALENDAR_ID = 'primary'

/** Creates a pending sync state for every Google account (or only `userId`'s) that has none yet. */
export const ensureCalendarSyncStates = async (userId?: string) => {
  const googleAccounts = await getDb()
    .select({ id: account.id, userId: account.userId })
    .from(account)
    .where(and(eq(account.providerId, 'google'), userId ? eq(account.userId, userId) : undefined))
  if (googleAccounts.length === 0) return

  await getDb()
    .insert(calendarSyncState)
    .values(googleAccounts.map(({ id, userId }) => ({ id: crypto.randomUUID(), userId, accountId: id, calendarId: PRIMARY_CALENDAR_ID })))
    .onConflictDoNothing({ target: [calendarSyncState.userId, calendarSyncState.calendarId] })
}
