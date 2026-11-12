import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { company } from '@/lib/db/schema/crm'
import { eq } from 'drizzle-orm'

/** What the icon route needs: the stored logo, whether the one-time favicon import ran, and the website. */
export const getCompanyLogoState = async (id: string) => {
  await requireUserId()
  const [row] = await getDb()
    .select({ website: company.website, logoKey: company.logoKey, logoCheckedAt: company.logoCheckedAt })
    .from(company)
    .where(eq(company.id, id))
    .limit(1)
  return row ?? null
}
