import { describe, expect, it } from 'vitest'
import type { SyncedContactFields } from '@/lib/google-contacts-sync/synced-contact-fields'
import { toGooglePerson } from '@/lib/google-contacts-sync/to-google-person'

const fields: SyncedContactFields = {
  firstName: 'Christoph',
  lastName: 'Nienaber',
  email: 'christoph@nienaber.de',
  phone: '+49 111',
  whatsApp: '+49 222',
  birthday: { month: 3, day: 17, year: 1996 },
}

describe('toGooglePerson', () => {
  it('contains only name, email, phone, WhatsApp, and birthday', () => {
    const person = toGooglePerson({ ...fields, company: 'Drehimpuls', tags: ['BNI'], linkedIn: 'x', avatarUrl: 'https://example.com/a.png', isPrivate: true, displayId: 2 } as SyncedContactFields)
    expect(Object.keys(person).sort()).toEqual(['birthdays', 'emailAddresses', 'names', 'phoneNumbers'])
    expect(JSON.stringify(person)).not.toMatch(/company|tag|linkedIn|instagram|avatar|private|displayId/i)
    expect(person.names).toEqual([{ givenName: 'Christoph', familyName: 'Nienaber' }])
    expect(person.emailAddresses).toEqual([{ value: 'christoph@nienaber.de' }])
    expect(person.phoneNumbers).toEqual([
      { value: '+49 111', type: 'mobile' },
      { value: '+49 222', type: 'WhatsApp' },
    ])
    expect(person.birthdays).toEqual([{ date: { month: 3, day: 17, year: 1996 } }])
  })

  it('omits an optional year and empty contact methods', () => {
    const person = toGooglePerson({ ...fields, email: null, phone: null, whatsApp: null, birthday: { month: 3, day: 17 } })
    expect(person.emailAddresses).toEqual([])
    expect(person.phoneNumbers).toEqual([])
    expect(person.birthdays).toEqual([{ date: { month: 3, day: 17 } }])
  })
})
