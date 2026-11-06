import 'server-only'

import { getVisibleContact } from '@/lib/db/contacts/get-visible-contact'
import { softDeleteContact } from '@/lib/db/contacts/soft-delete-contact'
import { pushContact } from '@/lib/google-contacts-sync/push-contact'

/** Hides the contact in the OS and removes it from every Google account it was synced to. */
export const deleteContact = async (displayId: number) => {
  const existing = await getVisibleContact(displayId)
  if (!existing) return { ok: false as const, message: 'Kontakt wurde nicht gefunden.' }
  const removed = await softDeleteContact(existing.id)
  if (!removed) return { ok: false as const, message: 'Kontakt wurde nicht gefunden.' }
  await pushContact(existing.id)
  return { ok: true as const }
}
