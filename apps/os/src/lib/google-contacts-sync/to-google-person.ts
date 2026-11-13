import type { ContactLabeledValue } from '@/lib/db/schema/crm'
import type { SyncedContactFields } from '@/lib/google-contacts-sync/synced-contact-fields'
import { WHATSAPP_PHONE_TYPE } from '@/lib/google-contacts-sync/whatsapp-phone-type'

const toGoogleValue = ({ value, type }: ContactLabeledValue) => (type ? { value, type } : { value })

/** People API body: name, all email addresses, all phone numbers plus WhatsApp, and birthday. Nothing else. */
export const toGooglePerson = (fields: SyncedContactFields) => {
  const phoneNumbers = [
    ...fields.phones.map(toGoogleValue),
    ...(fields.whatsApp ? [{ value: fields.whatsApp, type: WHATSAPP_PHONE_TYPE }] : []),
  ]
  const date = fields.birthday
    ? { month: fields.birthday.month, day: fields.birthday.day, ...(fields.birthday.year ? { year: fields.birthday.year } : {}) }
    : null

  return {
    names: [{ givenName: fields.firstName, familyName: fields.lastName }],
    emailAddresses: fields.emails.map(toGoogleValue),
    phoneNumbers,
    birthdays: date ? [{ date }] : [],
  }
}
