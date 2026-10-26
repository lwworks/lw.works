import { getSelectAllState } from '@/lib/time-tracking/get-select-all-state'
import { describe, expect, it } from 'vitest'

describe('getSelectAllState', () => {
  it('is unchecked, indeterminate or checked depending on the count', () => {
    expect(getSelectAllState(0, 3)).toBe(false)
    expect(getSelectAllState(2, 3)).toBe('indeterminate')
    expect(getSelectAllState(3, 3)).toBe(true)
  })
})
