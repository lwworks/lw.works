import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { company } from '@/lib/db/schema/crm'
import { project } from '@/lib/db/schema/projects'
import { and, asc, eq, isNull, ne } from 'drizzle-orm'

/** Projects that time entries can be assigned to by hand: not archived and not completed. */
export const listAssignableProjects = async () => {
  await requireUserId()
  return getDb()
    .select({ id: project.id, key: project.key, title: project.title, companyId: project.companyId, companyLogoKey: company.logoKey })
    .from(project)
    .innerJoin(company, eq(company.id, project.companyId))
    .where(and(isNull(project.archivedAt), ne(project.status, 'completed')))
    .orderBy(asc(project.key))
}

export type AssignableProject = Awaited<ReturnType<typeof listAssignableProjects>>[number]
