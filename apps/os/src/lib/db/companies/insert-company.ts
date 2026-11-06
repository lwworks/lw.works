import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import type { CompanyInput } from '@/lib/companies/parse-company-input'
import { getDb } from '@/lib/db/get-db'
import { company } from '@/lib/db/schema/crm'

export const insertCompany = async (input: CompanyInput) => {
  await requireUserId()
  const [row] = await getDb()
    .insert(company)
    .values({ id: crypto.randomUUID(), ...input })
    .returning({ id: company.id })
  if (!row) throw new Error('Company insert returned no row')
  return row
}
