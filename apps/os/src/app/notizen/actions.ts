'use server'

import { editNote } from '@/lib/notes/edit-note'
import { removeNote } from '@/lib/notes/remove-note'
import { refresh } from 'next/cache'

/** `doc` is the editor's JSON; `editNote` validates it. */
export async function editNoteAction(id: string, doc: unknown) {
  const result = await editNote(id, doc)
  if (!result.ok) return result
  refresh()
  return { ok: true as const }
}

export async function removeNoteAction(id: string) {
  const result = await removeNote(id)
  if (!result.ok) return result
  refresh()
  return { ok: true as const }
}
