import { describe, expect, it } from 'vitest'
import { contactAudience } from '@/lib/google-contacts-sync/contact-audience'

const members = ['ada', 'bea']

describe('contactAudience', () => {
  it('is the creator only when Privat is on', () => {
    expect(contactAudience({ isPrivate: true, createdByUserId: 'ada', memberIds: members })).toEqual(['ada'])
    expect(contactAudience({ isPrivate: true, createdByUserId: 'not-a-member', memberIds: members })).toEqual([])
  })

  it('is every member id when Privat is off', () => {
    expect(contactAudience({ isPrivate: false, createdByUserId: 'ada', memberIds: members })).toEqual(members)
  })
})
