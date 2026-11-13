import { describe, expect, it } from 'vitest'
import { fromGooglePerson, type GooglePerson } from '@/lib/google-contacts-sync/from-google-person'

const person: GooglePerson = {
  resourceName: 'people/c1',
  etag: 'etag',
  metadata: { sources: [{ updateTime: '2026-03-01T00:00:00Z' }, { updateTime: '2026-04-01T00:00:00Z' }] },
  names: [{ givenName: 'Ada', familyName: 'Lovelace' }],
  emailAddresses: [{ value: 'ada@lw.works', type: 'work' }, { value: 'ada@example.com' }, { value: ' ' }],
  phoneNumbers: [
    { value: '+49 111', type: 'mobile' },
    { value: '+49 222', type: 'WhatsApp' },
    { value: '+49 333', type: 'Büro' },
  ],
  birthdays: [{ date: { month: 12, day: 10, year: 0 } }],
}

describe('fromGooglePerson', () => {
  it('keeps every email and phone, separates WhatsApp, and drops a missing year', () => {
    expect(fromGooglePerson(person)).toEqual({
      resourceName: 'people/c1',
      etag: 'etag',
      updateTime: '2026-04-01T00:00:00Z',
      fields: {
        firstName: 'Ada',
        lastName: 'Lovelace',
        emails: [
          { value: 'ada@lw.works', type: 'work' },
          { value: 'ada@example.com', type: null },
        ],
        phones: [
          { value: '+49 111', type: 'mobile' },
          { value: '+49 333', type: 'Büro' },
        ],
        whatsApp: '+49 222',
        birthday: { month: 12, day: 10 },
      },
    })
  })

  it('ignores a deleted person', () => {
    expect(fromGooglePerson({ ...person, metadata: { deleted: true } })).toBeNull()
  })
})
