import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { user } from '@/lib/db/schema/auth'
import { note } from '@/lib/db/schema/notes'
import type { NoteDoc } from '@/lib/notes/note-doc'
import { desc, eq } from 'drizzle-orm'

export type NoteListItem = {
  id: string
  content: NoteDoc
  authorName: string
  authorImage: string | null
  canEdit: boolean
  createdAt: Date
  updatedAt: Date
}

/** Notes of one contact, newest first. The caller checks that the contact is visible (`getVisibleContact`). */
export const listContactNotes = async (contactId: string): Promise<NoteListItem[]> => {
  const userId = await requireUserId()
  const rows = await getDb()
    .select({
      id: note.id,
      content: note.content,
      authorId: note.createdByUserId,
      authorName: user.name,
      authorImage: user.image,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    })
    .from(note)
    .innerJoin(user, eq(note.createdByUserId, user.id))
    .where(eq(note.contactId, contactId))
    .orderBy(desc(note.createdAt))
  return rows.map(({ authorId, ...row }) => ({ ...row, canEdit: authorId === userId }))
}
