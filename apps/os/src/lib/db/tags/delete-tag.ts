import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { tag } from '@/lib/db/schema/crm'
import { eq } from 'drizzle-orm'

/** Hard-delete. Contact links detach through `ON DELETE CASCADE`. Does not call Google. */
export const deleteTag = async (id: string) => {
  await requireUserId()
  const [row] = await getDb().delete(tag).where(eq(tag.id, id)).returning({ id: tag.id })
  return row ?? null
}
