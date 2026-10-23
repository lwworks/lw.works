/** Header checkbox state for `selectedCount` of `total` rows. */
export const getSelectAllState = (selectedCount: number, total: number): boolean | 'indeterminate' =>
  selectedCount === 0 ? false : selectedCount >= total ? true : 'indeterminate'
