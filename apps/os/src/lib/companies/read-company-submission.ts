import { parseCompanyInput, type CompanyInput } from '@/lib/companies/parse-company-input'
import { readOptionalText } from '@/lib/contacts/read-optional-text'

export type CompanySubmission =
  | { kind: 'none' }
  | { kind: 'existing'; companyId: string }
  | { kind: 'new'; value: CompanyInput }
  | { kind: 'invalid'; message: string }

/** Existing company, a company created with this contact, or none. A new company is not synced anywhere. */
export const readCompanySubmission = (formData: FormData): CompanySubmission => {
  if (formData.get('newCompany') === 'true') {
    const parsed = parseCompanyInput(formData)
    if (!parsed.ok) return { kind: 'invalid', message: parsed.message }
    return { kind: 'new', value: parsed.value }
  }

  const companyId = readOptionalText(formData.get('companyId'), 80)
  if (!companyId) return { kind: 'none' }
  return { kind: 'existing', companyId }
}
