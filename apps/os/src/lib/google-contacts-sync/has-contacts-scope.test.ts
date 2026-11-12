import { describe, expect, it } from 'vitest'
import { hasContactsScope } from './has-contacts-scope'

const CONTACTS = 'https://www.googleapis.com/auth/contacts'

describe('hasContactsScope', () => {
  it('reads comma-separated scopes as better-auth stores them', () => {
    expect(hasContactsScope(`openid,email,${CONTACTS},profile`)).toBe(true)
  })
  it('reads space-separated scopes', () => {
    expect(hasContactsScope(`openid ${CONTACTS}`)).toBe(true)
  })
  it('does not match a longer scope with the same prefix', () => {
    expect(hasContactsScope(`${CONTACTS}.readonly`)).toBe(false)
  })
  it('handles a missing scope', () => {
    expect(hasContactsScope(null)).toBe(false)
  })
})
