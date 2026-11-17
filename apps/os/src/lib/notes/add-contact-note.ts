import 'server-only'

import { getVisibleContact } from '@/lib/db/contacts/get-visible-contact'
import { insertNote } from '@/lib/db/notes/insert-note'
import { parseNoteDoc } from '@/lib/notes/parse-note-doc'

/** Adds a note to a contact the signed-in user can see. `raw` is the editor's JSON from the client. */
export const addContactNote = async (displayId: number, raw: unknown) => {
  const contact = await getVisibleContact(displayId)
  if (!contact) return { ok: false as const, message: 'Kontakt wurde nicht gefunden.' }
  const parsed = parseNoteDoc(raw)
  if (!parsed.ok) return parsed
  await insertNote({ contactId: contact.id }, parsed.value)
  return { ok: true as const }
}
