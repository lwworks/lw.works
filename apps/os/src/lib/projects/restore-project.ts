import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { postgresErrorCode } from '@/lib/db/postgres-error-code'
import { restoreProjectRow } from '@/lib/db/projects/restore-project-row'

/** Un-archives the project, unless its key was given to another project meanwhile. */
export const restoreProject = async (id: string) => {
  await requireUserId()
  try {
    await restoreProjectRow(id)
  } catch (error) {
    if (postgresErrorCode(error) === '23505') return { ok: false as const, message: 'Das Kürzel gehört inzwischen zu einem anderen Projekt.' }
    throw error
  }
  return { ok: true as const }
}
