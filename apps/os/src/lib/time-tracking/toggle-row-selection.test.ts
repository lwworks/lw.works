import { toggleRowSelection } from '@/lib/time-tracking/toggle-row-selection'
import { describe, expect, it } from 'vitest'

const ids = ['a', 'b', 'c', 'd', 'e']
const toggle = (selected: string[], anchorId: string | null, targetId: string, extendRange: boolean) =>
  [...toggleRowSelection({ ids, selected: new Set(selected), anchorId, targetId, extendRange })].sort()

describe('toggleRowSelection', () => {
  it('toggles a single row without a range', () => {
    expect(toggle([], 'a', 'c', false)).toEqual(['c'])
    expect(toggle(['c'], 'a', 'c', false)).toEqual([])
  })

  it('selects every row between anchor and target in either direction', () => {
    expect(toggle(['b'], 'b', 'd', true)).toEqual(['b', 'c', 'd'])
    expect(toggle(['d'], 'd', 'a', true)).toEqual(['a', 'b', 'c', 'd'])
  })

  it('deselects the range when the target was selected', () => {
    expect(toggle(['a', 'b', 'c', 'd', 'e'], 'b', 'd', true)).toEqual(['a', 'e'])
  })

  it('falls back to a single toggle without a known anchor', () => {
    expect(toggle([], null, 'c', true)).toEqual(['c'])
    expect(toggle([], 'gone', 'c', true)).toEqual(['c'])
  })
})
