import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getVisibleContact } from '@/lib/db/contacts/get-visible-contact'
import { updateContactPrivacy } from '@/lib/db/contacts/update-contact-privacy'
import { pushContact } from '@/lib/google-contacts-sync/push-contact'

/** Creator-only. Privat on removes the contact from other members' Google accounts immediately. */
export const setContactPrivacy = async (displayId: number, isPrivate: boolean) => {
  const userId = await requireUserId()
  const existing = await getVisibleContact(displayId)
  if (!existing) return { ok: false as const, message: 'Kontakt wurde nicht gefunden.' }
  if (existing.createdByUserId !== userId) return { ok: false as const, message: 'Nur der Ersteller kann Privat ändern.' }
  if (existing.isPrivate === isPrivate) return { ok: true as const }

  const updated = await updateContactPrivacy(existing.id, isPrivate)
  if (!updated) return { ok: false as const, message: 'Kontakt wurde nicht gefunden.' }
  await pushContact(existing.id)
  return { ok: true as const }
}
