import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import type { CompanyInput } from '@/lib/companies/parse-company-input'
import { getDb } from '@/lib/db/get-db'
import { company } from '@/lib/db/schema/crm'
import { eq } from 'drizzle-orm'

export const updateCompany = async (id: string, input: CompanyInput) => {
  await requireUserId()
  const [row] = await getDb().update(company).set(input).where(eq(company.id, id)).returning({ id: company.id })
  return row ?? null
}
