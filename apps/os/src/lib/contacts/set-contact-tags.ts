import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getVisibleContact } from '@/lib/db/contacts/get-visible-contact'
import { replaceContactTags } from '@/lib/db/contacts/replace-contact-tags'
import { findMissingTagIds } from '@/lib/db/tags/find-missing-tag-ids'

/** Replaces the tags of a visible contact. Tags stay in the OS, so Google is not called. */
export const setContactTags = async (displayId: number, tagIds: readonly string[]) => {
  await requireUserId()
  const unique = [...new Set(tagIds)]
  if (unique.length > 100) return { ok: false as const, message: 'Zu viele Tags.' }
  const existing = await getVisibleContact(displayId)
  if (!existing) return { ok: false as const, message: 'Kontakt wurde nicht gefunden.' }
  if ((await findMissingTagIds(unique)).length > 0) return { ok: false as const, message: 'Ein Tag wurde nicht gefunden.' }
  await replaceContactTags(existing.id, unique)
  return { ok: true as const }
}
