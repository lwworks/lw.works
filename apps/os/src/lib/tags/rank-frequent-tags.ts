/** The most used tags (at least one use), most used first; ties keep the input order. */
export const rankFrequentTags = <T extends { usageCount: number }>(tags: readonly T[], limit = 3): T[] =>
  tags
    .filter((tag) => tag.usageCount > 0)
    .map((tag, index) => ({ tag, index }))
    .sort((a, b) => b.tag.usageCount - a.tag.usageCount || a.index - b.index)
    .slice(0, limit)
    .map(({ tag }) => tag)
