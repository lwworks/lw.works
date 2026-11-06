import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import type { ContactInput } from '@/lib/contacts/parse-contact-input'
import { visibleContactWhere } from '@/lib/db/contacts/visible-contact-where'
import { getDb } from '@/lib/db/get-db'
import { contact } from '@/lib/db/schema/crm'
import { and, eq } from 'drizzle-orm'

/** Updates a contact the signed-in user may see. Pass `syncedFieldsEditedAt` only when a synced field changed. */
export const updateContact = async (id: string, input: ContactInput, syncedFieldsEditedAt: Date | null) => {
  const userId = await requireUserId()
  const [row] = await getDb()
    .update(contact)
    .set({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
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
      ...(syncedFieldsEditedAt ? { syncedFieldsEditedAt } : {}),
    })
    .where(and(eq(contact.id, id), visibleContactWhere(userId)))
    .returning({ id: contact.id })
  return row ?? null
}
