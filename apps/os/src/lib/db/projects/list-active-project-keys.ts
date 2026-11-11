import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { project } from '@/lib/db/schema/projects'
import { isNull } from 'drizzle-orm'

/** Key → project ID of every non-archived project. Used by the calendar sync, so there is no user session. */
export const listActiveProjectKeys = async () => {
  const rows = await getDb().select({ id: project.id, key: project.key }).from(project).where(isNull(project.archivedAt))
  return new Map(rows.map((row) => [row.key, row.id]))
}
