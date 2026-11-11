import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { project, projectContact } from '@/lib/db/schema/projects'
import type { ProjectInput } from '@/lib/projects/parse-project-input'
import { eq } from 'drizzle-orm'

/** Updates the editable fields and replaces the contacts. Key and company never change. */
export const updateProject = async (id: string, input: ProjectInput & { slug: string }) => {
  await requireUserId()
  const { contactIds, ...values } = input
  await getDb().batch([
    getDb().update(project).set(values).where(eq(project.id, id)),
    getDb().delete(projectContact).where(eq(projectContact.projectId, id)),
    getDb().insert(projectContact).values(contactIds.map((contactId) => ({ projectId: id, contactId }))),
  ])
}
