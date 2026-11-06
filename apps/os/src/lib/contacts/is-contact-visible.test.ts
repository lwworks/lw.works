import { describe, expect, it } from 'vitest'
import { isContactVisible } from '@/lib/contacts/is-contact-visible'

const contact = { deletedAt: null, isPrivate: false, createdByUserId: 'creator' }

describe('isContactVisible', () => {
  it('hides a soft-deleted contact from its creator', () => {
    expect(isContactVisible({ ...contact, deletedAt: new Date('2026-01-01T00:00:00Z') }, 'creator')).toBe(false)
    expect(isContactVisible({ ...contact, deletedAt: new Date('2026-01-01T00:00:00Z'), isPrivate: true }, 'creator')).toBe(false)
  })

  it('shows a shared contact to every viewer and a private contact only to its creator', () => {
    expect(isContactVisible(contact, 'someone-else')).toBe(true)
    expect(isContactVisible({ ...contact, isPrivate: true }, 'someone-else')).toBe(false)
    expect(isContactVisible({ ...contact, isPrivate: true }, 'creator')).toBe(true)
  })
})
