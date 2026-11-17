import 'server-only'

import { deleteNote } from '@/lib/db/notes/delete-note'
import { getOwnNote } from '@/lib/db/notes/get-own-note'

/** Deletes one of the signed-in user's notes. */
export const removeNote = async (id: string) => {
  const existing = await getOwnNote(id)
  if (!existing) return { ok: false as const, message: 'Notiz wurde nicht gefunden.' }
  const deleted = await deleteNote(existing.id)
  if (!deleted) return { ok: false as const, message: 'Notiz wurde nicht gefunden.' }
  return { ok: true as const }
}
