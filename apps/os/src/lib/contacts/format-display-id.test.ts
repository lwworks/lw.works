import { describe, expect, it } from 'vitest'
import { formatDisplayId } from '@/lib/contacts/format-display-id'

describe('formatDisplayId', () => {
  it('pads to at least four digits', () => {
    expect(formatDisplayId(1)).toBe('#0001')
    expect(formatDisplayId(42)).toBe('#0042')
    expect(formatDisplayId(10000)).toBe('#10000')
  })
})
