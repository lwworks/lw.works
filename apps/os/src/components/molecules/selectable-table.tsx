"use client"

import { groupRowClass, leadGutterCell, leadGutterInner } from "@/components/molecules/table-gutters"
import type { RowSelection } from "@/lib/selection/use-row-selection"
import { Button } from "@lw/ui/components/button"
import { Checkbox } from "@lw/ui/components/checkbox"
import { TableCell, TableHead, TableHeader, TableRow } from "@lw/ui/components/table"
import { cn } from "@lw/ui/lib/utils"
import type { MouseEvent, ReactNode } from "react"

/**
 * Building blocks for list tables (shadcn `Table`): a select-all checkbox in the leading gutter of the header and
 * a checkbox per row. Text columns use `firstTextCell` / `lastTextCell` from `table-gutters` to line up with the
 * page content; a trailing button sits in `trailGutterCell`.
 */
export const SelectableTableHeader = ({ selection, label, children }: { selection: RowSelection; label: string; children: ReactNode }) => (
  <ListTableHeader select={<Checkbox aria-label={label} checked={selection.allState} disabled={!selection.hasRows} onCheckedChange={selection.toggleAll} />}>
    {children}
  </ListTableHeader>
)

/** The header row itself, with any node in the leading gutter (a skeleton while loading). */
export const ListTableHeader = ({ select, children }: { select: ReactNode; children: ReactNode }) => (
  <TableHeader>
    <TableRow className={cn("border-t border-neutral-200 hover:bg-transparent dark:border-neutral-800")}>
      <TableHead className={cn(leadGutterCell)}>
        <div className={cn(leadGutterInner)}>{select}</div>
      </TableHead>
      {children}
    </TableRow>
  </TableHeader>
)

/** Shaded row heading a group of rows (e.g. one day); its checkbox selects the whole group. */
export const SelectableTableGroupRow = ({ selection, ids, label, children }: { selection: RowSelection; ids: readonly string[]; label: string; children: ReactNode }) => (
  <TableRow className={cn(groupRowClass)}>
    <TableCell className={cn(leadGutterCell)}>
      <div className={cn(leadGutterInner)}>
        <Checkbox aria-label={label} checked={selection.groupState(ids)} onCheckedChange={() => selection.toggleGroup(ids)} />
      </div>
    </TableCell>
    {children}
  </TableRow>
)

export const SelectableTableRow = ({
  selection,
  id,
  label,
  className,
  children,
}: {
  selection: RowSelection
  id: string
  /** Accessible name of the row checkbox, e.g. "RE-1001 auswählen". */
  label: string
  className?: string
  children: ReactNode
}) => {
  const selected = selection.isSelected(id)
  return (
    <TableRow data-state={selected ? "selected" : undefined} className={cn("hover:bg-transparent", className)}>
      <TableCell className={cn(leadGutterCell)}>
        <div className={cn(leadGutterInner)}>
          <Checkbox aria-label={label} checked={selected} onMouseDown={preventShiftTextSelection} onClick={(event) => selection.toggle(id, event.shiftKey)} />
        </div>
      </TableCell>
      {children}
    </TableRow>
  )
}

/** Full-width message row for an empty table; `columns` counts every cell including the gutters. */
export const EmptyTableRow = ({ columns, children }: { columns: number; children: ReactNode }) => (
  <TableRow className={cn("hover:bg-transparent")}>
    <TableCell colSpan={columns} className={cn("h-16 px-4 text-neutral-500 sm:px-8 lg:px-16")}>{children}</TableCell>
  </TableRow>
)

/** Floating bar while rows are selected: the count (plus `detail`, e.g. a sum), any `children` actions and "Auswahl aufheben". */
export const SelectionBar = ({ selection, label, count, detail, children }: { selection: RowSelection; label: string; count: string; detail?: ReactNode; children?: ReactNode }) =>
  selection.selectedIds.length === 0 ? null : (
    <div
      role="toolbar"
      aria-label={label}
      className={cn(
        "fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-neutral-200 bg-white p-2 pl-4 text-sm shadow-lg dark:border-neutral-800 dark:bg-neutral-950",
      )}
    >
      <span className={cn("font-medium whitespace-nowrap text-black tabular-nums dark:text-white")}>
        {count}
        {detail ? <span className={cn("font-normal text-neutral-500")}> · {detail}</span> : null}
      </span>
      {children}
      <Button variant="ghost" size="sm" onClick={selection.clear}>Auswahl aufheben</Button>
    </div>
  )

/** Keeps Shift+click from also selecting the text between the clicked checkboxes. */
const preventShiftTextSelection = (event: MouseEvent) => {
  if (event.shiftKey) event.preventDefault()
}
