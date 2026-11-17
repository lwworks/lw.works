import 'server-only'

import { getOwnNote } from '@/lib/db/notes/get-own-note'
import { updateNoteContent } from '@/lib/db/notes/update-note-content'
import { parseNoteDoc } from '@/lib/notes/parse-note-doc'

/** Replaces the content of one of the signed-in user's notes. `raw` is the editor's JSON from the client. */
export const editNote = async (id: string, raw: unknown) => {
  const existing = await getOwnNote(id)
  if (!existing) return { ok: false as const, message: 'Notiz wurde nicht gefunden.' }
  const parsed = parseNoteDoc(raw)
  if (!parsed.ok) return parsed
  const updated = await updateNoteContent(existing.id, parsed.value)
  if (!updated) return { ok: false as const, message: 'Notiz wurde nicht gefunden.' }
  return { ok: true as const }
}
