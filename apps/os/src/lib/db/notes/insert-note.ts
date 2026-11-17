import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { note } from '@/lib/db/schema/notes'
import type { NoteDoc } from '@/lib/notes/note-doc'

export type NoteOwner = { contactId: string } | { companyId: string } | { projectId: string }

/** Inserts a note by the signed-in user. `content` must come from `parseNoteDoc`. */
export const insertNote = async (owner: NoteOwner, content: NoteDoc) => {
  const userId = await requireUserId()
  const [row] = await getDb()
    .insert(note)
    .values({ id: crypto.randomUUID(), content, createdByUserId: userId, ...owner })
    .returning({ id: note.id })
  if (!row) throw new Error('Note insert returned no row')
  return row
}
