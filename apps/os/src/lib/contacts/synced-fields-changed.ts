import type { SyncedContactFields } from '@/lib/google-contacts-sync/synced-contact-fields'

const valuesKey = (values: SyncedContactFields['emails']) => JSON.stringify(values.map(({ value, type }) => [value, type]))

const birthdayKey = (birthday: SyncedContactFields['birthday']) =>
  birthday ? `${birthday.year ?? ''}-${birthday.month}-${birthday.day}` : ''

/** Company, tags, social profiles, and avatar are not compared: those edits must not push or block a pull. */
export const syncedFieldsChanged = (before: SyncedContactFields, after: SyncedContactFields) =>
  before.firstName !== after.firstName ||
  before.lastName !== after.lastName ||
  valuesKey(before.emails) !== valuesKey(after.emails) ||
  valuesKey(before.phones) !== valuesKey(after.phones) ||
  before.whatsApp !== after.whatsApp ||
  birthdayKey(before.birthday) !== birthdayKey(after.birthday)
