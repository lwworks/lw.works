import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { company } from '@/lib/db/schema/crm'
import { project } from '@/lib/db/schema/projects'
import { timeEntry } from '@/lib/db/schema/time-tracking'
import { and, asc, eq, gte, isNull, lt, sql } from 'drizzle-orm'

export type TimeEntryDTO = Awaited<ReturnType<typeof getOwnTimeEntries>>[number]

/** The signed-in user's non-deleted entries starting in `[start, end)`, with their project. */
export const getOwnTimeEntries = async ({ start, end }: { start: Date; end: Date }) => {
  const userId = await requireUserId()
  return getDb()
    .select({
      id: timeEntry.id,
      title: timeEntry.title,
      location: timeEntry.location,
      attendeeCount: sql<number>`jsonb_array_length(${timeEntry.attendees})`.mapWith(Number),
      startAt: timeEntry.startAt,
      endAt: timeEntry.endAt,
      htmlLink: timeEntry.htmlLink,
      projectAssignment: timeEntry.projectAssignment,
      project: { key: project.key, title: project.title, slug: project.slug, companyId: project.companyId },
      /** Logo of the project's company (null without project or logo). */
      projectLogoKey: company.logoKey,
    })
    .from(timeEntry)
    .leftJoin(project, eq(project.id, timeEntry.projectId))
    .leftJoin(company, eq(company.id, project.companyId))
    .where(and(eq(timeEntry.userId, userId), isNull(timeEntry.deletedAt), gte(timeEntry.startAt, start), lt(timeEntry.startAt, end)))
    .orderBy(asc(timeEntry.startAt))
}
