import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { contact } from '@/lib/db/schema/crm'
import type { SyncedContactFields } from '@/lib/google-contacts-sync/synced-contact-fields'
import { and, eq, isNotNull, isNull, lte, or } from 'drizzle-orm'

/**
 * Writes synced fields from a pull. The WHERE clause is `inboundMayOverwrite`, so a newer OS edit
 * is left untouched. `synced_fields_edited_at` is not set: a pull is not an OS edit.
 */
export const applyInboundContact = async (id: string, fields: SyncedContactFields, at: Date) => {
  const [row] = await getDb()
    .update(contact)
    .set({
      firstName: fields.firstName,
      lastName: fields.lastName,
      email: fields.email,
      phone: fields.phone,
      whatsApp: fields.whatsApp,
      birthdayMonth: fields.birthday?.month ?? null,
      birthdayDay: fields.birthday?.day ?? null,
      birthdayYear: fields.birthday?.year ?? null,
      lastInboundAt: at,
    })
    .where(
      and(
        eq(contact.id, id),
        isNull(contact.deletedAt),
        or(isNull(contact.syncedFieldsEditedAt), and(isNotNull(contact.lastInboundAt), lte(contact.syncedFieldsEditedAt, contact.lastInboundAt))),
      ),
    )
    .returning({ id: contact.id })
  return Boolean(row)
}
