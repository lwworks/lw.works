/** Selects every id of the group, or deselects them all when the whole group is already selected. */
export const toggleGroupSelection = ({ selected, groupIds }: { selected: ReadonlySet<string>; groupIds: readonly string[] }): Set<string> => {
  const next = new Set(selected)
  const allSelected = groupIds.every((id) => selected.has(id))
  for (const id of groupIds) {
    if (allSelected) next.delete(id)
    else next.add(id)
  }
  return next
}
