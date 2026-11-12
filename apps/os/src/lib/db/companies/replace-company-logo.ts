import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { company, type CompanyLogoSource } from '@/lib/db/schema/crm'
import { eq, sql } from 'drizzle-orm'

/**
 * Sets a new logo and returns the key it replaced (so the caller can delete that object), or `undefined` when the
 * company doesn't exist. Also marks the one-time favicon import as done, so it never overwrites this logo.
 */
export const replaceCompanyLogo = async (id: string, key: string, source: CompanyLogoSource) => {
  await requireUserId()
  const db = getDb()
  const [existing] = await db.select({ logoKey: company.logoKey }).from(company).where(eq(company.id, id)).limit(1)
  if (!existing) return undefined
  await db
    .update(company)
    .set({ logoKey: key, logoSource: source, logoCheckedAt: sql`coalesce(${company.logoCheckedAt}, now())` })
    .where(eq(company.id, id))
  return existing.logoKey
}
