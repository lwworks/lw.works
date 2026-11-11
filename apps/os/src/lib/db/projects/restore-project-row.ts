import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { project } from '@/lib/db/schema/projects'
import { eq } from 'drizzle-orm'

/** Un-archives the project. Fails with a unique violation when its key was given to another project meanwhile. */
export const restoreProjectRow = async (id: string) => {
  await requireUserId()
  await getDb().update(project).set({ archivedAt: null }).where(eq(project.id, id))
}
