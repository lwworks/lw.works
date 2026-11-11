import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { visibleContactWhere } from '@/lib/db/contacts/visible-contact-where'
import { listCompanyProjects } from '@/lib/db/projects/list-company-projects'
import { getDb } from '@/lib/db/get-db'
import { company, contact } from '@/lib/db/schema/crm'
import { and, asc, eq } from 'drizzle-orm'

/** Company plus the contacts the signed-in user is allowed to see and its non-archived projects. */
export const getCompany = async (id: string) => {
  const userId = await requireUserId()
  const [row] = await getDb().select().from(company).where(eq(company.id, id)).limit(1)
  if (!row) return null

  const [contacts, projects] = await Promise.all([
    getDb()
      .select({
        displayId: contact.displayId,
        firstName: contact.firstName,
        lastName: contact.lastName,
        avatarUrl: contact.avatarUrl,
      })
      .from(contact)
      .where(and(eq(contact.companyId, id), visibleContactWhere(userId)))
      .orderBy(asc(contact.displayId)),
    listCompanyProjects(id),
  ])

  return { ...row, contacts, projects }
}

export type CompanyDetail = NonNullable<Awaited<ReturnType<typeof getCompany>>>
