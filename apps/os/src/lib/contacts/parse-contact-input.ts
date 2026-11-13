import { readLabeledValues } from '@/lib/contacts/read-labeled-values'
import { readOptionalText } from '@/lib/contacts/read-optional-text'
import type { SyncedContactFields } from '@/lib/google-contacts-sync/synced-contact-fields'

export type ContactInput = SyncedContactFields & {
  linkedIn: string | null
  instagram: string | null
  x: string | null
  avatarUrl: string | null
  companyId: string | null
  tagIds: string[]
  isPrivate: boolean
}

const maxValues = 10

const daysInMonth = (month: number, year?: number) => new Date(Date.UTC(year ?? 2024, month, 0)).getUTCDate()

const parseBirthday = (formData: FormData): { ok: true; value: SyncedContactFields['birthday'] } | { ok: false; message: string } => {
  const monthText = readOptionalText(formData.get('birthdayMonth'), 2)
  const dayText = readOptionalText(formData.get('birthdayDay'), 2)
  const yearText = readOptionalText(formData.get('birthdayYear'), 4)
  if (!monthText && !dayText && !yearText) return { ok: true, value: null }
  const month = Number(monthText)
  const day = Number(dayText)
  const year = yearText ? Number(yearText) : undefined
  if (!monthText || !dayText || !Number.isInteger(month) || !Number.isInteger(day) || month < 1 || month > 12 || day < 1) {
    return { ok: false, message: 'Geburtstag braucht Tag und Monat.' }
  }
  if (year !== undefined && (!Number.isInteger(year) || year < 1900 || year > 2100)) {
    return { ok: false, message: 'Geburtsjahr muss zwischen 1900 und 2100 liegen.' }
  }
  if (day > daysInMonth(month, year)) return { ok: false, message: 'Geburtstag ist kein gültiges Datum.' }
  return { ok: true, value: { month, day, ...(year ? { year } : {}) } }
}

/** At least one of first or last name. No role. Emails and phones repeat as `emailValue`/`emailType` and `phoneValue`/`phoneType`. */
export const parseContactInput = (formData: FormData): { ok: true; value: ContactInput } | { ok: false; message: string } => {
  const firstName = readOptionalText(formData.get('firstName'), 100) ?? ''
  const lastName = readOptionalText(formData.get('lastName'), 100) ?? ''
  if (!firstName && !lastName) return { ok: false, message: 'Vorname oder Nachname ist erforderlich.' }

  const birthday = parseBirthday(formData)
  if (!birthday.ok) return birthday

  const emails = readLabeledValues(formData, 'email', 320)
  const phones = readLabeledValues(formData, 'phone', 40)
  if (emails.length > maxValues) return { ok: false, message: `Höchstens ${maxValues} E-Mail-Adressen.` }
  if (phones.length > maxValues) return { ok: false, message: `Höchstens ${maxValues} Telefonnummern.` }

  const companyId = readOptionalText(formData.get('companyId'), 80)
  const tagIds = [...new Set(formData.getAll('tagIds').flatMap((value) => (typeof value === 'string' && value ? [value] : [])))]
  const privacy = formData.get('isPrivate')

  return {
    ok: true,
    value: {
      firstName,
      lastName,
      emails,
      phones,
      whatsApp: readOptionalText(formData.get('whatsApp'), 40),
      linkedIn: readOptionalText(formData.get('linkedIn'), 200),
      instagram: readOptionalText(formData.get('instagram'), 200),
      x: readOptionalText(formData.get('x'), 200),
      avatarUrl: readOptionalText(formData.get('avatarUrl'), 500),
      birthday: birthday.value,
      companyId,
      tagIds,
      isPrivate: privacy === 'true' || privacy === 'on',
    },
  }
}
