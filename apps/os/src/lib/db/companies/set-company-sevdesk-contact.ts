import 'server-only'

import { requireAdmin } from '@/lib/auth/require-admin'
import { getDb } from '@/lib/db/get-db'
import { company } from '@/lib/db/schema/crm'
import { eq } from 'drizzle-orm'

/** Links the company to a SevDesk customer, or unlinks it with null. Fails if another company has that customer. */
export const setCompanySevdeskContact = async (companyId: string, sevdeskContactId: string | null) => {
  await requireAdmin()
  const rows = await getDb().update(company).set({ sevdeskContactId }).where(eq(company.id, companyId)).returning({ id: company.id })
  return rows.length > 0
}
