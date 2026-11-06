import type { SyncedContactFields } from '@/lib/google-contacts-sync/synced-contact-fields'

const birthdayKey = (birthday: SyncedContactFields['birthday']) =>
  birthday ? `${birthday.year ?? ''}-${birthday.month}-${birthday.day}` : ''

/** Company, tags, social profiles, and avatar are not compared: those edits must not push or block a pull. */
export const syncedFieldsChanged = (before: SyncedContactFields, after: SyncedContactFields) =>
  before.firstName !== after.firstName ||
  before.lastName !== after.lastName ||
  before.email !== after.email ||
  before.phone !== after.phone ||
  before.whatsApp !== after.whatsApp ||
  birthdayKey(before.birthday) !== birthdayKey(after.birthday)
