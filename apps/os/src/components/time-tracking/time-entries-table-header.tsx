import { TableHead, TableHeader, TableRow } from '@lw/ui/components/table'
import { cn } from '@lw/ui/lib/utils'
import type { ReactNode } from 'react'
import { firstTextCell, lastTextCell, leadGutterCell, leadGutterInner, trailGutterCell } from './table-gutters'

export const TimeEntriesTableHeader = ({ selectAll }: { selectAll: ReactNode }) => {
  return (
    <TableHeader>
      <TableRow className="border-t border-neutral-200 dark:border-neutral-800 hover:bg-transparent">
        <TableHead className={cn(leadGutterCell)}>
          <div className={cn(leadGutterInner)}>{selectAll}</div>
        </TableHead>
        <TableHead className={cn(firstTextCell)}>Zeit</TableHead>
        <TableHead>Termin</TableHead>
        <TableHead className="text-right">Projekt</TableHead>
        <TableHead className={cn('text-right', lastTextCell)}>Dauer</TableHead>
        <TableHead className={cn(trailGutterCell)}><span className="sr-only">Link</span></TableHead>
      </TableRow>
    </TableHeader>
  )
}
