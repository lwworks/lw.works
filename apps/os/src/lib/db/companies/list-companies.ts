import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { company } from '@/lib/db/schema/crm'
import { asc } from 'drizzle-orm'

export const listCompanies = async () => {
  await requireUserId()
  return getDb()
    .select({
      id: company.id,
      name: company.name,
      logoUrl: company.logoUrl,
      website: company.website,
      city: company.city,
    })
    .from(company)
    .orderBy(asc(company.name))
}

export type CompanyListItem = Awaited<ReturnType<typeof listCompanies>>[number]
