import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { project } from '@/lib/db/schema/projects'
import { timeEntry } from '@/lib/db/schema/time-tracking'
import { and, eq, isNull, sql } from 'drizzle-orm'

/**
 * Archives the project, which frees its key, and turns its automatic assignments into manual ones so the entries
 * stay with it: the sync leaves them alone and a new project with the same key does not take them over.
 */
export const archiveProjectRow = async (id: string) => {
  await requireUserId()
  await getDb().batch([
    getDb()
      .update(project)
      .set({ archivedAt: sql`now()` })
      .where(and(eq(project.id, id), isNull(project.archivedAt))),
    getDb()
      .update(timeEntry)
      .set({ projectAssignment: 'manual' })
      .where(and(eq(timeEntry.projectId, id), eq(timeEntry.projectAssignment, 'auto'))),
  ])
}
