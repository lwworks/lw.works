import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import type { CompanyInput } from '@/lib/companies/parse-company-input'
import { getDb } from '@/lib/db/get-db'
import { company, companyLocation } from '@/lib/db/schema/crm'

/** Inserts the company and its locations in one transaction. */
export const insertCompany = async ({ locations, ...input }: CompanyInput) => {
  await requireUserId()
  const id = crypto.randomUUID()
  const db = getDb()
  const insertRow = db.insert(company).values({ id, ...input }).returning({ id: company.id })
  if (locations.length === 0) {
    await insertRow
  } else {
    await db.batch([
      insertRow,
      db.insert(companyLocation).values(
        locations.map((location, position) => ({
          id: crypto.randomUUID(),
          companyId: id,
          position,
          label: location.label,
          street: location.street,
          postalCode: location.postalCode,
          city: location.city,
          country: location.country,
        })),
      ),
    ])
  }
  return { id }
}
