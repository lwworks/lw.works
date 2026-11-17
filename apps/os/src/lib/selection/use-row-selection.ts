import { getSelectAllState } from '@/lib/time-tracking/get-select-all-state'
import { toggleGroupSelection } from '@/lib/time-tracking/toggle-group-selection'
import { toggleRowSelection } from '@/lib/time-tracking/toggle-row-selection'
import { useState } from 'react'

export type RowSelection = ReturnType<typeof useRowSelection>

/**
 * Checkbox selection of table rows. `ids` in visual order, so Shift+click ranges match what the user sees.
 * Ids that left the list (filter, refresh) no longer count as selected.
 */
export const useRowSelection = (ids: readonly string[]) => {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set())
  const [anchorId, setAnchorId] = useState<string | null>(null)
  const selectedIds = ids.filter((id) => selected.has(id))

  return {
    selectedIds,
    isSelected: (id: string) => selected.has(id),
    allState: getSelectAllState(selectedIds.length, ids.length),
    hasRows: ids.length > 0,
    toggle: (targetId: string, extendRange: boolean) => {
      setSelected(toggleRowSelection({ ids, selected, anchorId, targetId, extendRange }))
      setAnchorId(targetId)
    },
    /** Header checkbox state of a group of rows, e.g. one day. */
    groupState: (groupIds: readonly string[]) => getSelectAllState(groupIds.filter((id) => selected.has(id)).length, groupIds.length),
    toggleGroup: (groupIds: readonly string[]) => setSelected(toggleGroupSelection({ selected, groupIds })),
    toggleAll: () => setSelected(new Set(selectedIds.length === ids.length ? [] : ids)),
    clear: () => setSelected(new Set()),
  }
}
