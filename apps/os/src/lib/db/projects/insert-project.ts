import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { titleProjectKeySql } from '@/lib/db/projects/project-key-sql'
import { project, projectContact } from '@/lib/db/schema/projects'
import { timeEntry } from '@/lib/db/schema/time-tracking'
import type { ProjectInput } from '@/lib/projects/parse-project-input'
import { and, eq, isNull, or } from 'drizzle-orm'

/**
 * Inserts the project with its contacts and, in the same batch, assigns every existing time entry (all users) whose
 * title starts with `KEY:` and that has no manual assignment.
 */
export const insertProject = async (input: ProjectInput & { key: string; companyId: string; slug: string }) => {
  await requireUserId()
  const id = crypto.randomUUID()
  const { contactIds, ...values } = input
  await getDb().batch([
    getDb().insert(project).values({ id, ...values }),
    getDb().insert(projectContact).values(contactIds.map((contactId) => ({ projectId: id, contactId }))),
    getDb()
      .update(timeEntry)
      .set({ projectId: id, projectAssignment: 'auto' })
      .where(
        and(
          eq(titleProjectKeySql(), input.key),
          or(isNull(timeEntry.projectAssignment), eq(timeEntry.projectAssignment, 'auto')),
        ),
      ),
  ])
  return { id }
}
