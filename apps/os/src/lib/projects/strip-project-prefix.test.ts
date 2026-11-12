import { describe, expect, it } from 'vitest'
import { stripProjectPrefix } from '@/lib/projects/strip-project-prefix'

describe('stripProjectPrefix', () => {
  it('drops the prefix of the entry project', () => {
    expect(stripProjectPrefix('BR: Abstimmung', 'BR')).toBe('Abstimmung')
  })

  it('keeps titles of other or no projects, and bare prefixes', () => {
    expect(stripProjectPrefix('BR: Abstimmung', 'LW')).toBe('BR: Abstimmung')
    expect(stripProjectPrefix('BR: Abstimmung', null)).toBe('BR: Abstimmung')
    expect(stripProjectPrefix('BR:', 'BR')).toBe('BR:')
  })
})
