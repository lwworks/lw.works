import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { project } from '@/lib/db/schema/projects'
import { and, asc, eq, isNull } from 'drizzle-orm'

/** The company's non-archived projects. */
export const listCompanyProjects = async (companyId: string) => {
  await requireUserId()
  return getDb()
    .select({ id: project.id, key: project.key, slug: project.slug, title: project.title, status: project.status, companyId: project.companyId })
    .from(project)
    .where(and(eq(project.companyId, companyId), isNull(project.archivedAt)))
    .orderBy(asc(project.key))
}
