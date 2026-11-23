import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { project } from '@/lib/db/schema/projects'
import type { NoteDoc } from '@/lib/notes/note-doc'
import { and, eq, isNull } from 'drizzle-orm'

/** Replaces the description of a non-archived project. `description` must come from `parseNoteDoc`, or be null. */
export const updateProjectDescription = async (id: string, description: NoteDoc | null) => {
  await requireUserId()
  const [row] = await getDb()
    .update(project)
    .set({ description })
    .where(and(eq(project.id, id), isNull(project.archivedAt)))
    .returning({ id: project.id })
  return row ?? null
}
