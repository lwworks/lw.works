import { toggleGroupSelection } from '@/lib/time-tracking/toggle-group-selection'
import { describe, expect, it } from 'vitest'

const toggle = (selected: string[], groupIds: string[]) => [...toggleGroupSelection({ selected: new Set(selected), groupIds })].sort()

describe('toggleGroupSelection', () => {
  it('selects the whole group when none or some of it is selected, keeping other rows', () => {
    expect(toggle(['x'], ['a', 'b'])).toEqual(['a', 'b', 'x'])
    expect(toggle(['a', 'x'], ['a', 'b'])).toEqual(['a', 'b', 'x'])
  })

  it('deselects the group when all of it is selected, keeping other rows', () => {
    expect(toggle(['a', 'b', 'x'], ['a', 'b'])).toEqual(['x'])
  })
})
