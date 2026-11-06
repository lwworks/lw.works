import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { contact } from '@/lib/db/schema/crm'
import { eq } from 'drizzle-orm'

/** Contact row for an outbound push, including a soft-deleted one that still needs to leave Google. */
export const getContactForPush = async (id: string) => {
  const [row] = await getDb().select().from(contact).where(eq(contact.id, id)).limit(1)
  return row ?? null
}
