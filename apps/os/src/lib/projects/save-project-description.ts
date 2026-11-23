import 'server-only'

import { getProjectMeta } from '@/lib/db/projects/get-project-meta'
import { updateProjectDescription } from '@/lib/db/projects/update-project-description'
import { parseNoteDoc } from '@/lib/notes/parse-note-doc'

/**
 * Saves the project description edited in place. `raw` is the editor's JSON from the client, or null for an empty
 * description. Archived projects are read-only.
 */
export const saveProjectDescription = async (id: string, raw: unknown) => {
  const existing = await getProjectMeta(id)
  if (!existing) return { ok: false as const, message: 'Projekt wurde nicht gefunden.' }
  if (existing.archivedAt) return { ok: false as const, message: 'Archivierte Projekte können nicht bearbeitet werden.' }
  let description = null
  if (raw !== null) {
    const parsed = parseNoteDoc(raw)
    // Empty arrives as null, so a failure here means invalid or too long.
    if (!parsed.ok) return { ok: false as const, message: 'Die Beschreibung ist ungültig oder zu lang.' }
    description = parsed.value
  }
  const updated = await updateProjectDescription(existing.id, description)
  if (!updated) return { ok: false as const, message: 'Projekt wurde nicht gefunden.' }
  return { ok: true as const }
}
