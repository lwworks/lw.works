import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { archiveProjectRow } from '@/lib/db/projects/archive-project-row'

/** Archives the project: frees its key and keeps its time entries assigned. */
export const archiveProject = async (id: string) => {
  await requireUserId()
  await archiveProjectRow(id)
  return { ok: true as const }
}
