import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { account } from '@/lib/db/schema/auth'
import { and, eq } from 'drizzle-orm'

export const getOwnGoogleAccount = async () => {
  const userId = await requireUserId()
  const [row] = await getDb()
    .select({ accountId: account.id, scope: account.scope })
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, 'google')))
    .limit(1)
  return row ?? null
}
