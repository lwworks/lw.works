import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { setContactTags } from '@/lib/contacts/set-contact-tags'
import { getVisibleContact } from '@/lib/db/contacts/get-visible-contact'
import { insertTag } from '@/lib/db/tags/insert-tag'
import { parseTagInput } from '@/lib/tags/parse-tag-input'

/** Creates a tag with the picked color and adds it to the contact. */
export const addNewTagToContact = async (displayId: number, name: string, color: string) => {
  await requireUserId()
  const existing = await getVisibleContact(displayId)
  if (!existing) return { ok: false as const, message: 'Kontakt wurde nicht gefunden.' }

  const formData = new FormData()
  formData.set('name', name)
  formData.set('color', color)
  const parsed = parseTagInput(formData)
  if (!parsed.ok) return parsed
  const created = await insertTag(parsed.value)
  if (!created.ok) return created

  return setContactTags(displayId, [...existing.tags.map((tag) => tag.id), created.id])
}
