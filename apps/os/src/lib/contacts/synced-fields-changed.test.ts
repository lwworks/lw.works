import { describe, expect, it } from 'vitest'
import { syncedFieldsChanged } from '@/lib/contacts/synced-fields-changed'
import type { SyncedContactFields } from '@/lib/google-contacts-sync/synced-contact-fields'

const fields: SyncedContactFields = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  emails: [{ value: 'ada@lw.works', type: 'work' }],
  phones: [],
  whatsApp: null,
  birthday: { month: 12, day: 10 },
}

describe('syncedFieldsChanged', () => {
  it('is false when only the synced fields are unchanged', () => {
    expect(syncedFieldsChanged(fields, { ...fields, emails: [{ value: 'ada@lw.works', type: 'work' }], birthday: { month: 12, day: 10 } })).toBe(false)
  })

  it('is true when a synced field changes', () => {
    expect(syncedFieldsChanged(fields, { ...fields, emails: [] })).toBe(true)
    expect(syncedFieldsChanged(fields, { ...fields, emails: [{ value: 'ada@lw.works', type: 'home' }] })).toBe(true)
    expect(syncedFieldsChanged(fields, { ...fields, phones: [{ value: '+49 1', type: 'mobile' }] })).toBe(true)
    expect(syncedFieldsChanged(fields, { ...fields, birthday: { month: 12, day: 10, year: 1815 } })).toBe(true)
  })
})
