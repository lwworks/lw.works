'use server'

import { readBusinessCard } from '@/lib/business-card/read-business-card'
import { createContact } from '@/lib/contacts/create-contact'
import { deleteContact } from '@/lib/contacts/delete-contact'
import { saveContact } from '@/lib/contacts/save-contact'
import { setContactPrivacy } from '@/lib/contacts/set-contact-privacy'
import { createTag } from '@/lib/tags/create-tag'
import { removeTag } from '@/lib/tags/remove-tag'
import { refresh } from 'next/cache'
import { redirect } from 'next/navigation'

type FormActionState = { ok: true } | { ok: false; message: string } | null

export async function createContactAction(_prev: FormActionState, formData: FormData) {
  const result = await createContact(formData)
  if (!result.ok) return result
  refresh()
  redirect(`/kontakte/${result.displayId}`)
}

export async function saveContactAction(displayId: number, _prev: FormActionState, formData: FormData) {
  const result = await saveContact(displayId, formData)
  if (!result.ok) return result
  refresh()
  return { ok: true as const }
}

export async function deleteContactAction(displayId: number) {
  const result = await deleteContact(displayId)
  if (!result.ok) return result
  refresh()
  redirect('/kontakte')
}

export async function setContactPrivacyAction(displayId: number, isPrivate: boolean) {
  const result = await setContactPrivacy(displayId, isPrivate)
  if (!result.ok) return result
  refresh()
  return { ok: true as const }
}

export async function createTagAction(_prev: FormActionState, formData: FormData) {
  const result = await createTag(formData)
  if (!result.ok) return result
  refresh()
  return null
}

export async function removeTagAction(id: string) {
  const result = await removeTag(id)
  if (!result.ok) return result
  refresh()
  return { ok: true as const }
}

export async function readBusinessCardAction(formData: FormData) {
  return readBusinessCard(formData)
}
