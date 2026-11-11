import 'server-only'

import { readCompanySubmission } from '@/lib/companies/read-company-submission'
import { companyExists } from '@/lib/db/companies/company-exists'
import { insertCompany } from '@/lib/db/companies/insert-company'
import { findMissingTagIds } from '@/lib/db/tags/find-missing-tag-ids'
import { insertContact } from '@/lib/db/contacts/insert-contact'
import { replaceContactTags } from '@/lib/db/contacts/replace-contact-tags'
import { parseContactInput } from '@/lib/contacts/parse-contact-input'
import { pushContact } from '@/lib/google-contacts-sync/push-contact'
import { requireUserId } from '@/lib/auth/require-user-id'

/** Creates a new company first when the form asks for one, then saves the contact and pushes its synced fields. Companies are not synced to Google. A Google failure does not undo the save. */
export const createContact = async (formData: FormData) => {
  await requireUserId()
  const parsed = parseContactInput(formData)
  if (!parsed.ok) return parsed
  const company = readCompanySubmission(formData)
  if (company.kind === 'invalid') return { ok: false as const, message: company.message }
  if ((await findMissingTagIds(parsed.value.tagIds)).length > 0) {
    return { ok: false as const, message: 'Ein Tag wurde nicht gefunden.' }
  }
  if (company.kind === 'new') {
    parsed.value.companyId = (await insertCompany(company.value)).id
  } else if (company.kind === 'existing') {
    if (!(await companyExists(company.companyId))) {
      return { ok: false as const, message: 'Unternehmen wurde nicht gefunden.' }
    }
    parsed.value.companyId = company.companyId
  } else {
    parsed.value.companyId = null
  }

  const row = await insertContact(parsed.value)
  await replaceContactTags(row.id, parsed.value.tagIds)
  await pushContact(row.id)
  return { ok: true as const, displayId: row.displayId }
}
