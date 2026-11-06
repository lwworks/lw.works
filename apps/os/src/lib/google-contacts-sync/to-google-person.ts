import type { SyncedContactFields } from '@/lib/google-contacts-sync/synced-contact-fields'
import { WHATSAPP_PHONE_TYPE } from '@/lib/google-contacts-sync/whatsapp-phone-type'

/** People API body: name, email, phone, WhatsApp, and birthday. Nothing else. */
export const toGooglePerson = (fields: SyncedContactFields) => {
  const phoneNumbers = [
    ...(fields.phone ? [{ value: fields.phone, type: 'mobile' }] : []),
    ...(fields.whatsApp ? [{ value: fields.whatsApp, type: WHATSAPP_PHONE_TYPE }] : []),
  ]
  const date = fields.birthday
    ? { month: fields.birthday.month, day: fields.birthday.day, ...(fields.birthday.year ? { year: fields.birthday.year } : {}) }
    : null

  return {
    names: [{ givenName: fields.firstName, familyName: fields.lastName }],
    emailAddresses: fields.email ? [{ value: fields.email }] : [],
    phoneNumbers,
    birthdays: date ? [{ date }] : [],
  }
}
