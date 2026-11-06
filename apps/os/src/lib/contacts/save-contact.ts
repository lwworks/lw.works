import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { companyExists } from '@/lib/db/companies/company-exists'
import { getVisibleContact } from '@/lib/db/contacts/get-visible-contact'
import { replaceContactTags } from '@/lib/db/contacts/replace-contact-tags'
import { updateContact } from '@/lib/db/contacts/update-contact'
import { findMissingTagIds } from '@/lib/db/tags/find-missing-tag-ids'
import { parseContactInput } from '@/lib/contacts/parse-contact-input'
import { syncedFieldsChanged } from '@/lib/contacts/synced-fields-changed'
import { pushContact } from '@/lib/google-contacts-sync/push-contact'

/** Edits a visible contact. Only a synced-field change or a privacy change calls Google. */
export const saveContact = async (displayId: number, formData: FormData) => {
  const userId = await requireUserId()
  const existing = await getVisibleContact(displayId)
  if (!existing) return { ok: false as const, message: 'Kontakt wurde nicht gefunden.' }

  const parsed = parseContactInput(formData)
  if (!parsed.ok) return parsed
  if (parsed.value.isPrivate !== existing.isPrivate && existing.createdByUserId !== userId) {
    return { ok: false as const, message: 'Nur der Ersteller kann Privat ändern.' }
  }
  if (parsed.value.companyId && !(await companyExists(parsed.value.companyId))) {
    return { ok: false as const, message: 'Unternehmen wurde nicht gefunden.' }
  }
  if ((await findMissingTagIds(parsed.value.tagIds)).length > 0) {
    return { ok: false as const, message: 'Ein Tag wurde nicht gefunden.' }
  }

  const input = { ...parsed.value, isPrivate: existing.createdByUserId === userId ? parsed.value.isPrivate : existing.isPrivate }
  const syncedChanged = syncedFieldsChanged(existing, input)
  const privacyChanged = input.isPrivate !== existing.isPrivate
  const updated = await updateContact(existing.id, input, syncedChanged ? new Date() : null)
  if (!updated) return { ok: false as const, message: 'Kontakt wurde nicht gefunden.' }
  await replaceContactTags(existing.id, input.tagIds)
  if (syncedChanged || privacyChanged) await pushContact(existing.id)
  return { ok: true as const }
}
