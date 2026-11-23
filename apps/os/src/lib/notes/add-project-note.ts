import 'server-only'

import { getProjectMeta } from '@/lib/db/projects/get-project-meta'
import { insertNote } from '@/lib/db/notes/insert-note'
import { parseNoteDoc } from '@/lib/notes/parse-note-doc'

/** Adds a note to a project (visible to every member, archived ones too). `raw` is the editor's JSON from the client. */
export const addProjectNote = async (projectId: string, raw: unknown) => {
  const project = await getProjectMeta(projectId)
  if (!project) return { ok: false as const, message: 'Projekt wurde nicht gefunden.' }
  const parsed = parseNoteDoc(raw)
  if (!parsed.ok) return parsed
  await insertNote({ projectId: project.id }, parsed.value)
  return { ok: true as const }
}
