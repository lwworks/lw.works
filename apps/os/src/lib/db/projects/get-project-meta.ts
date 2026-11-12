import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { project } from '@/lib/db/schema/projects'
import { eq } from 'drizzle-orm'

/** The fields needed to validate a change to a project. */
export const getProjectMeta = async (id: string) => {
  await requireUserId()
  const [row] = await getDb()
    .select({ id: project.id, key: project.key, companyId: project.companyId, archivedAt: project.archivedAt })
    .from(project)
    .where(eq(project.id, id))
    .limit(1)
  return row ?? null
}
