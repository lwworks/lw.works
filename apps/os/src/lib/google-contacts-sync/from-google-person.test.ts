import { describe, expect, it } from 'vitest'
import { fromGooglePerson, type GooglePerson } from '@/lib/google-contacts-sync/from-google-person'

const person: GooglePerson = {
  resourceName: 'people/c1',
  etag: 'etag',
  metadata: { sources: [{ updateTime: '2026-03-01T00:00:00Z' }, { updateTime: '2026-04-01T00:00:00Z' }] },
  names: [{ givenName: 'Ada', familyName: 'Lovelace' }],
  emailAddresses: [{ value: 'ada@lw.works' }],
  phoneNumbers: [
    { value: '+49 111', type: 'mobile' },
    { value: '+49 222', type: 'WhatsApp' },
  ],
  birthdays: [{ date: { month: 12, day: 10, year: 0 } }],
}

describe('fromGooglePerson', () => {
  it('separates WhatsApp from the main phone and drops a missing year', () => {
    expect(fromGooglePerson(person)).toEqual({
      resourceName: 'people/c1',
      etag: 'etag',
      updateTime: '2026-04-01T00:00:00Z',
      fields: {
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@lw.works',
        phone: '+49 111',
        whatsApp: '+49 222',
        birthday: { month: 12, day: 10 },
      },
    })
  })

  it('ignores a deleted person', () => {
    expect(fromGooglePerson({ ...person, metadata: { deleted: true } })).toBeNull()
  })
})
