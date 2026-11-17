"use client"

import { EmptyTableRow, SelectableTableHeader, SelectableTableRow, SelectionBar } from "@/components/molecules/selectable-table"
import { firstTextCell, lastTextCell, trailGutterCell } from "@/components/molecules/table-gutters"
import { formatMoney } from "@/lib/format/format-money"
import { useRowSelection } from "@/lib/selection/use-row-selection"
import type { SevdeskPosition } from "@/lib/sevdesk/get-sevdesk-positions"
import { Table, TableBody, TableCell, TableHead } from "@lw/ui/components/table"
import { cn } from "@lw/ui/lib/utils"

const quantityFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 })

export const InvoicePositionsTable = ({ positions, currency }: { positions: SevdeskPosition[]; currency: string }) => {
  const selection = useRowSelection(positions.map((position) => position.id))
  const selectedCount = selection.selectedIds.length
  const selectedNetCents = positions.filter((position) => selection.isSelected(position.id)).reduce((sum, position) => sum + position.netCents, 0)
  return (
    <>
      <Table className={cn("min-w-xl")}>
        <SelectableTableHeader selection={selection} label="Alle Positionen auswählen">
          <TableHead className={cn(firstTextCell)}>Position</TableHead>
          <TableHead className={cn("text-right")}>Menge</TableHead>
          <TableHead className={cn("text-right")}>Einzelpreis</TableHead>
          <TableHead className={cn("text-right")}>USt.</TableHead>
          <TableHead className={cn("text-right", lastTextCell)}>Netto</TableHead>
          <TableHead className={cn(trailGutterCell)} />
        </SelectableTableHeader>
        <TableBody>
          {positions.length === 0 ? <EmptyTableRow columns={7}>Keine Positionen.</EmptyTableRow> : null}
          {positions.map((position) => (
            <SelectableTableRow key={position.id} selection={selection} id={position.id} label={`${position.name} auswählen`} className={cn("[&>td]:align-top [&>td]:py-2.5")}>
              <TableCell className={cn("w-full max-w-0 whitespace-normal", firstTextCell)}>
                <span className={cn("font-medium text-black dark:text-white")}>{position.name}</span>
                {position.text ? <span className={cn("mt-0.5 block whitespace-pre-line text-xs")}>{position.text}</span> : null}
              </TableCell>
              <TableCell className={cn("text-right tabular-nums")}>{quantityFormat.format(position.quantity)}</TableCell>
              <TableCell className={cn("text-right tabular-nums")}>{formatMoney(position.unitNetCents, currency)}</TableCell>
              <TableCell className={cn("text-right tabular-nums")}>{position.taxRate} %</TableCell>
              <TableCell className={cn("text-right tabular-nums text-black dark:text-white", lastTextCell)}>{formatMoney(position.netCents, currency)}</TableCell>
              <TableCell className={cn(trailGutterCell)} />
            </SelectableTableRow>
          ))}
        </TableBody>
      </Table>
      <SelectionBar
        selection={selection}
        label="Ausgewählte Positionen"
        count={selectedCount === 1 ? "1 Position" : `${selectedCount} Positionen`}
        detail={`${formatMoney(selectedNetCents, currency)} netto`}
      />
    </>
  )
}
