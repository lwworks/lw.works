import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getProjectMeta } from '@/lib/db/projects/get-project-meta'
import { setOwnTimeEntriesProject } from '@/lib/db/time-entries/set-own-time-entries-project'

/** Assigns the signed-in user's entries to a project, or to none (`projectId: null`), by hand. The sync keeps that. */
export const assignTimeEntries = async (ids: string[], projectId: string | null) => {
  await requireUserId()
  if (projectId) {
    const project = await getProjectMeta(projectId)
    if (!project || project.archivedAt) return { ok: false as const, message: 'Projekt wurde nicht gefunden.' }
  }
  await setOwnTimeEntriesProject(ids, projectId)
  return { ok: true as const }
}
