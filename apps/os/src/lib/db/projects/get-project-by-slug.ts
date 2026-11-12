import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { visibleContactWhere } from '@/lib/db/contacts/visible-contact-where'
import { getDb } from '@/lib/db/get-db'
import { trackedMsSql } from '@/lib/db/projects/tracked-ms-sql'
import { company, contact } from '@/lib/db/schema/crm'
import { project, projectContact } from '@/lib/db/schema/projects'
import { and, asc, eq } from 'drizzle-orm'

/** Project with its customer, the contact persons the signed-in user may see, and the tracked time of all users. */
export const getProjectBySlug = async (slug: string) => {
  const userId = await requireUserId()
  const [row] = await getDb()
    .select({
      project,
      company: { id: company.id, name: company.name, logoKey: company.logoKey },
      trackedMs: trackedMsSql(),
    })
    .from(project)
    .innerJoin(company, eq(company.id, project.companyId))
    .where(eq(project.slug, slug))
    .limit(1)
  if (!row) return null

  const contacts = await getDb()
    .select({
      id: contact.id,
      displayId: contact.displayId,
      firstName: contact.firstName,
      lastName: contact.lastName,
      avatarUrl: contact.avatarUrl,
    })
    .from(projectContact)
    .innerJoin(contact, eq(contact.id, projectContact.contactId))
    .where(and(eq(projectContact.projectId, row.project.id), visibleContactWhere(userId)))
    .orderBy(asc(contact.lastName), asc(contact.firstName))

  return { ...row.project, company: row.company, trackedMs: row.trackedMs, contacts }
}

export type ProjectDetail = NonNullable<Awaited<ReturnType<typeof getProjectBySlug>>>
