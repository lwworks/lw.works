import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { parseCompanyInput } from '@/lib/companies/parse-company-input'
import { updateCompany } from '@/lib/db/companies/update-company'

export const saveCompany = async (id: string, formData: FormData) => {
  await requireUserId()
  const parsed = parseCompanyInput(formData)
  if (!parsed.ok) return parsed
  const row = await updateCompany(id, parsed.value)
  if (!row) return { ok: false as const, message: 'Unternehmen wurde nicht gefunden.' }
  return { ok: true as const }
}
