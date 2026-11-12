import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { trackedMsSql } from '@/lib/db/projects/tracked-ms-sql'
import { company } from '@/lib/db/schema/crm'
import { project } from '@/lib/db/schema/projects'
import { asc, eq, isNotNull, isNull } from 'drizzle-orm'

/** Active or archived projects with their customer and the tracked time of all users. */
export const listProjects = async ({ archived }: { archived: boolean }) => {
  await requireUserId()
  return getDb()
    .select({
      id: project.id,
      key: project.key,
      slug: project.slug,
      title: project.title,
      status: project.status,
      billing: project.billing,
      startDate: project.startDate,
      endDate: project.endDate,
      companyId: project.companyId,
      companyName: company.name,
      companyLogoKey: company.logoKey,
      trackedMs: trackedMsSql(),
    })
    .from(project)
    .innerJoin(company, eq(company.id, project.companyId))
    .where(archived ? isNotNull(project.archivedAt) : isNull(project.archivedAt))
    .orderBy(asc(project.key))
}

export type ProjectListItem = Awaited<ReturnType<typeof listProjects>>[number]
