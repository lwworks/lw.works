import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { project } from '@/lib/db/schema/projects'
import { and, eq, isNull } from 'drizzle-orm'

export const activeKeyExists = async (key: string) => {
  const [row] = await getDb()
    .select({ id: project.id })
    .from(project)
    .where(and(eq(project.key, key), isNull(project.archivedAt)))
    .limit(1)
  return Boolean(row)
}
