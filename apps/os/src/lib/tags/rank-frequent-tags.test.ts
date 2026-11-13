import { describe, expect, it } from 'vitest'
import { rankFrequentTags } from '@/lib/tags/rank-frequent-tags'

describe('rankFrequentTags', () => {
  it('returns used tags by usage, keeping input order on ties', () => {
    const tags = [
      { id: 'a', usageCount: 1 },
      { id: 'b', usageCount: 0 },
      { id: 'c', usageCount: 4 },
      { id: 'd', usageCount: 1 },
      { id: 'e', usageCount: 2 },
    ]
    expect(rankFrequentTags(tags).map((tag) => tag.id)).toEqual(['c', 'e', 'a'])
  })
})
