import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { note } from '@/lib/db/schema/notes'
import { and, eq } from 'drizzle-orm'

/** Author-only hard delete. */
export const deleteNote = async (id: string) => {
  const userId = await requireUserId()
  const [row] = await getDb()
    .delete(note)
    .where(and(eq(note.id, id), eq(note.createdByUserId, userId)))
    .returning({ id: note.id })
  return row ?? null
}
