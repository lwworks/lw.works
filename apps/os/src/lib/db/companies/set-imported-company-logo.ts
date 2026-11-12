import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { company, type CompanyLogoSource } from '@/lib/db/schema/crm'
import { and, eq, isNull } from 'drizzle-orm'

/** Stores an imported logo unless one was uploaded meanwhile. False when it wasn't stored. */
export const setImportedCompanyLogo = async (id: string, key: string, source: CompanyLogoSource) => {
  await requireUserId()
  const rows = await getDb()
    .update(company)
    .set({ logoKey: key, logoSource: source })
    .where(and(eq(company.id, id), isNull(company.logoKey)))
    .returning({ id: company.id })
  return rows.length > 0
}
