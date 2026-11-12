import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { company } from '@/lib/db/schema/crm'
import { and, eq, isNull, sql } from 'drizzle-orm'

/**
 * Marks the one-time logo import as done and returns what to import from — or null when it already ran or the
 * company has a logo. The conditional update makes sure only one caller (background job or icon request) imports.
 */
export const claimCompanyLogoImport = async (id: string) => {
  await requireUserId()
  const [row] = await getDb()
    .update(company)
    .set({ logoCheckedAt: sql`now()` })
    .where(and(eq(company.id, id), isNull(company.logoCheckedAt), isNull(company.logoKey)))
    .returning({ website: company.website, legacyLogoUrl: company.logoUrl })
  return row ?? null
}
