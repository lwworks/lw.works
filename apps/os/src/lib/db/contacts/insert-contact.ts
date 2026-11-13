import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import type { ContactInput } from '@/lib/contacts/parse-contact-input'
import { getDb } from '@/lib/db/get-db'
import { contact } from '@/lib/db/schema/crm'

export const insertContact = async (input: ContactInput) => {
  const userId = await requireUserId()
  const [row] = await getDb()
    .insert(contact)
    .values({
      id: crypto.randomUUID(),
      createdByUserId: userId,
      firstName: input.firstName,
      lastName: input.lastName,
      emails: input.emails,
      phones: input.phones,
      whatsApp: input.whatsApp,
      linkedIn: input.linkedIn,
      instagram: input.instagram,
      x: input.x,
      avatarUrl: input.avatarUrl,
      birthdayMonth: input.birthday?.month ?? null,
      birthdayDay: input.birthday?.day ?? null,
      birthdayYear: input.birthday?.year ?? null,
      isPrivate: input.isPrivate,
      companyId: input.companyId,
    })
    .returning({ id: contact.id, displayId: contact.displayId })
  if (!row) throw new Error('Contact insert returned no row')
  return row
}
