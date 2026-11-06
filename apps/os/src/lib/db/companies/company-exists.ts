import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { company } from '@/lib/db/schema/crm'
import { eq } from 'drizzle-orm'

export const companyExists = async (id: string) => {
  const [row] = await getDb().select({ id: company.id }).from(company).where(eq(company.id, id)).limit(1)
  return Boolean(row)
}
