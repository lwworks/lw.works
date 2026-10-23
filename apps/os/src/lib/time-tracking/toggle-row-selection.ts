/**
 * Toggles `targetId`. With `extendRange` and an `anchorId` that is still in `ids`, every id between
 * anchor and target (inclusive, in `ids` order) gets the target's new state instead.
 */
export const toggleRowSelection = ({
  ids,
  selected,
  anchorId,
  targetId,
  extendRange,
}: {
  ids: readonly string[]
  selected: ReadonlySet<string>
  anchorId: string | null
  targetId: string
  extendRange: boolean
}): Set<string> => {
  const checked = !selected.has(targetId)
  const targetIndex = ids.indexOf(targetId)
  const anchorIndex = extendRange && anchorId ? ids.indexOf(anchorId) : -1
  const range = anchorIndex === -1
    ? [targetId]
    : ids.slice(Math.min(anchorIndex, targetIndex), Math.max(anchorIndex, targetIndex) + 1)

  const next = new Set(selected)
  for (const id of range) {
    if (checked) next.add(id)
    else next.delete(id)
  }
  return next
}
