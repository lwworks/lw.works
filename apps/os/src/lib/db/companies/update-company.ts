import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import type { CompanyInput } from '@/lib/companies/parse-company-input'
import { getDb } from '@/lib/db/get-db'
import { company, companyLocation } from '@/lib/db/schema/crm'
import { and, eq, notInArray, sql } from 'drizzle-orm'

/**
 * Updates the company and replaces its locations in one transaction. Submitted locations keep their id;
 * locations missing from the input are deleted. An id that belongs to another company is not taken over.
 */
export const updateCompany = async (id: string, { locations, ...input }: CompanyInput) => {
  await requireUserId()
  const db = getDb()
  const [exists] = await db.select({ id: company.id }).from(company).where(eq(company.id, id)).limit(1)
  if (!exists) return null

  const ownIds = new Set(
    (await db.select({ id: companyLocation.id }).from(companyLocation).where(eq(companyLocation.companyId, id))).map((row) => row.id),
  )
  const rows = locations.map(({ id: locationId, ...location }, position) => ({
    id: locationId && ownIds.has(locationId) ? locationId : crypto.randomUUID(),
    companyId: id,
    position,
    ...location,
  }))
  const keptIds = rows.map((row) => row.id)

  const updateRow = db.update(company).set(input).where(eq(company.id, id))
  const deleteRemoved = db
    .delete(companyLocation)
    .where(keptIds.length > 0 ? and(eq(companyLocation.companyId, id), notInArray(companyLocation.id, keptIds)) : eq(companyLocation.companyId, id))
  if (rows.length === 0) {
    await db.batch([updateRow, deleteRemoved])
  } else {
    await db.batch([
      updateRow,
      deleteRemoved,
      db
        .insert(companyLocation)
        .values(rows)
        .onConflictDoUpdate({
          target: companyLocation.id,
          set: {
            position: sql`excluded.position`,
            label: sql`excluded.label`,
            street: sql`excluded.street`,
            postalCode: sql`excluded.postal_code`,
            city: sql`excluded.city`,
            country: sql`excluded.country`,
          },
        }),
    ])
  }
  return { id }
}
