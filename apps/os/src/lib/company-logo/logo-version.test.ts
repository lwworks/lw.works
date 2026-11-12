import { describe, expect, it } from 'vitest'
import { logoVersion } from './logo-version'

describe('logoVersion', () => {
  it('uses the last segment of the key', () => {
    expect(logoVersion('company-logos/c-1/0b7e')).toBe('0b7e')
  })
  it('is none without a logo', () => {
    expect(logoVersion(null)).toBe('none')
  })
})
