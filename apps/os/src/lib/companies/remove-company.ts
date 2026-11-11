import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { deleteCompany } from '@/lib/db/companies/delete-company'
import { postgresErrorCode } from '@/lib/db/postgres-error-code'

/** Hard-deletes the company and clears it from contacts. Does not call Google. Refused while it has projects. */
export const removeCompany = async (id: string) => {
  await requireUserId()
  try {
    const row = await deleteCompany(id)
    if (!row) return { ok: false as const, message: 'Unternehmen wurde nicht gefunden.' }
  } catch (error) {
    if (postgresErrorCode(error) === '23503') {
      return { ok: false as const, message: 'Das Unternehmen hat Projekte (auch archivierte) und kann nicht gelöscht werden.' }
    }
    throw error
  }
  return { ok: true as const }
}
