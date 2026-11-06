import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { parseCompanyInput } from '@/lib/companies/parse-company-input'
import { insertCompany } from '@/lib/db/companies/insert-company'

export const createCompany = async (formData: FormData) => {
  await requireUserId()
  const parsed = parseCompanyInput(formData)
  if (!parsed.ok) return parsed
  const row = await insertCompany(parsed.value)
  return { ok: true as const, id: row.id }
}
