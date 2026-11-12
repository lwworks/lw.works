import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { company, companyLocation } from '@/lib/db/schema/crm'
import { asc, sql } from 'drizzle-orm'

export const listCompanies = async () => {
  await requireUserId()
  return getDb()
    .select({
      id: company.id,
      name: company.name,
      logoKey: company.logoKey,
      website: company.website,
      /** Distinct cities of all locations, main site first. */
      cities: sql<string | null>`(
        select string_agg(${companyLocation.city}, ', ' order by first_position)
        from (
          select ${companyLocation.city}, min(${companyLocation.position}) as first_position
          from ${companyLocation}
          where ${companyLocation.companyId} = ${company.id} and ${companyLocation.city} is not null
          group by ${companyLocation.city}
        ) as location_city
      )`,
    })
    .from(company)
    .orderBy(asc(company.name))
}

export type CompanyListItem = Awaited<ReturnType<typeof listCompanies>>[number]
