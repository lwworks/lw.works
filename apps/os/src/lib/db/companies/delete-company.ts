import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { company } from '@/lib/db/schema/crm'
import { eq } from 'drizzle-orm'

/** Hard-delete. Contacts lose the link through `ON DELETE SET NULL`. Does not call Google. */
export const deleteCompany = async (id: string) => {
  await requireUserId()
  const [row] = await getDb().delete(company).where(eq(company.id, id)).returning({ id: company.id, logoKey: company.logoKey })
  return row ?? null
}
