import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { note } from '@/lib/db/schema/notes'
import type { NoteDoc } from '@/lib/notes/note-doc'
import { and, eq } from 'drizzle-orm'

/** Author-only. `content` must come from `parseNoteDoc`. */
export const updateNoteContent = async (id: string, content: NoteDoc) => {
  const userId = await requireUserId()
  const [row] = await getDb()
    .update(note)
    .set({ content })
    .where(and(eq(note.id, id), eq(note.createdByUserId, userId)))
    .returning({ id: note.id })
  return row ?? null
}
