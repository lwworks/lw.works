import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { user } from '@/lib/db/schema/auth'
import { note } from '@/lib/db/schema/notes'
import type { NoteDoc } from '@/lib/notes/note-doc'
import type { NoteOwner } from '@/lib/db/notes/insert-note'
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

/**
 * Notes of one contact, company or project, newest first. For contacts the caller checks that the contact is visible
 * (`getVisibleContact`); companies and projects are visible to every member.
 */
export const listNotes = async (owner: NoteOwner): Promise<NoteListItem[]> => {
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
    .where(ownerWhere(owner))
    .orderBy(desc(note.createdAt))
  return rows.map(({ authorId, ...row }) => ({ ...row, canEdit: authorId === userId }))
}

const ownerWhere = (owner: NoteOwner) =>
  'contactId' in owner
    ? eq(note.contactId, owner.contactId)
    : 'companyId' in owner
      ? eq(note.companyId, owner.companyId)
      : eq(note.projectId, owner.projectId)
