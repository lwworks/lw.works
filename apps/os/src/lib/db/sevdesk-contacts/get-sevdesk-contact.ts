import 'server-only'

import { requireAdmin } from '@/lib/auth/require-admin'
import { getDb } from '@/lib/db/get-db'
import { sevdeskContact } from '@/lib/db/schema/finance'
import { eq } from 'drizzle-orm'

/** One SevDesk customer, or null. */
export const getSevdeskContact = async (id: string) => {
  await requireAdmin()
  const [row] = await getDb()
    .select({ id: sevdeskContact.id, name: sevdeskContact.name, customerNumber: sevdeskContact.customerNumber })
    .from(sevdeskContact)
    .where(eq(sevdeskContact.id, id))
    .limit(1)
  return row ?? null
}
