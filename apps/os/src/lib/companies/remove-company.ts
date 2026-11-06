import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { deleteCompany } from '@/lib/db/companies/delete-company'

/** Hard-deletes the company and clears it from contacts. Does not call Google. */
export const removeCompany = async (id: string) => {
  await requireUserId()
  const row = await deleteCompany(id)
  if (!row) return { ok: false as const, message: 'Unternehmen wurde nicht gefunden.' }
  return { ok: true as const }
}
