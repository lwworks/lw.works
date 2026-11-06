import type { SyncedContactFields } from '@/lib/google-contacts-sync/synced-contact-fields'
import { WHATSAPP_PHONE_TYPE } from '@/lib/google-contacts-sync/whatsapp-phone-type'

export type GooglePerson = {
  resourceName?: string
  etag?: string
  metadata?: { deleted?: boolean; sources?: { updateTime?: string }[] }
  names?: { givenName?: string; familyName?: string }[]
  emailAddresses?: { value?: string }[]
  phoneNumbers?: { value?: string; type?: string }[]
  birthdays?: { date?: { year?: number; month?: number; day?: number } }[]
}

export type ParsedGooglePerson = {
  resourceName: string
  etag: string | null
  updateTime: string | null
  fields: SyncedContactFields
}

const latestUpdateTime = (person: GooglePerson) =>
  person.metadata?.sources?.reduce<string | null>((latest, source) => {
    if (!source.updateTime) return latest
    if (!latest || source.updateTime > latest) return source.updateTime
    return latest
  }, null) ?? null

/** Reads the synced fields back out of a People API person. A deleted person is ignored. */
export const fromGooglePerson = (person: GooglePerson): ParsedGooglePerson | null => {
  if (person.metadata?.deleted || !person.resourceName) return null
  const phones = person.phoneNumbers ?? []
  const whatsApp = phones.find((phone) => phone.type?.toLowerCase() === WHATSAPP_PHONE_TYPE.toLowerCase())?.value ?? null
  const phone = phones.find((phone) => phone.type?.toLowerCase() !== WHATSAPP_PHONE_TYPE.toLowerCase())?.value ?? null
  const date = person.birthdays?.[0]?.date
  const year = date?.year && date.year > 0 ? date.year : undefined
  const birthday = date?.month && date.day ? { month: date.month, day: date.day, ...(year ? { year } : {}) } : null

  return {
    resourceName: person.resourceName,
    etag: person.etag ?? null,
    updateTime: latestUpdateTime(person),
    fields: {
      firstName: person.names?.[0]?.givenName ?? '',
      lastName: person.names?.[0]?.familyName ?? '',
      email: person.emailAddresses?.[0]?.value ?? null,
      phone: phone ?? null,
      whatsApp: whatsApp ?? null,
      birthday,
    },
  }
}
