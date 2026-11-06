import 'server-only'

import { companyExists } from '@/lib/db/companies/company-exists'
import { findMissingTagIds } from '@/lib/db/tags/find-missing-tag-ids'
import { insertContact } from '@/lib/db/contacts/insert-contact'
import { replaceContactTags } from '@/lib/db/contacts/replace-contact-tags'
import { parseContactInput } from '@/lib/contacts/parse-contact-input'
import { pushContact } from '@/lib/google-contacts-sync/push-contact'
import { requireUserId } from '@/lib/auth/require-user-id'

/** Saves the contact, then pushes synced fields. A Google failure does not undo the save. */
export const createContact = async (formData: FormData) => {
  await requireUserId()
  const parsed = parseContactInput(formData)
  if (!parsed.ok) return parsed
  if (parsed.value.companyId && !(await companyExists(parsed.value.companyId))) {
    return { ok: false as const, message: 'Unternehmen wurde nicht gefunden.' }
  }
  if ((await findMissingTagIds(parsed.value.tagIds)).length > 0) {
    return { ok: false as const, message: 'Ein Tag wurde nicht gefunden.' }
  }

  const row = await insertContact(parsed.value)
  await replaceContactTags(row.id, parsed.value.tagIds)
  await pushContact(row.id)
  return { ok: true as const, displayId: row.displayId }
}
