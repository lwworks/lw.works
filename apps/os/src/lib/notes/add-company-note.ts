import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { companyExists } from '@/lib/db/companies/company-exists'
import { insertNote } from '@/lib/db/notes/insert-note'
import { parseNoteDoc } from '@/lib/notes/parse-note-doc'

/** Adds a note to a company (visible to every member). `raw` is the editor's JSON from the client. */
export const addCompanyNote = async (companyId: string, raw: unknown) => {
  await requireUserId()
  if (!(await companyExists(companyId))) return { ok: false as const, message: 'Unternehmen wurde nicht gefunden.' }
  const parsed = parseNoteDoc(raw)
  if (!parsed.ok) return parsed
  await insertNote({ companyId }, parsed.value)
  return { ok: true as const }
}
