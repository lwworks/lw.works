import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { account } from '@/lib/db/schema/auth'
import { eq } from 'drizzle-orm'

/** Google accounts that can receive a shared contact. Scope may or may not include Contacts. */
export const listGoogleAccounts = async () =>
  getDb()
    .select({ userId: account.userId, accountId: account.id, scope: account.scope })
    .from(account)
    .where(eq(account.providerId, 'google'))
