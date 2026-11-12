import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { parseCompanyInput } from '@/lib/companies/parse-company-input'
import { importCompanyLogo } from '@/lib/company-logo/import-company-logo'
import { insertCompany } from '@/lib/db/companies/insert-company'
import { after } from 'next/server'

export const createCompany = async (formData: FormData) => {
  await requireUserId()
  const parsed = parseCompanyInput(formData)
  if (!parsed.ok) return parsed
  const row = await insertCompany(parsed.value)
  // The favicon import fetches third-party sites; don't make the user wait for it.
  after(() => importCompanyLogo(row.id))
  return { ok: true as const, id: row.id }
}
