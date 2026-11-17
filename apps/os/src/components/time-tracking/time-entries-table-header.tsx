import { ListTableHeader } from '@/components/molecules/selectable-table'
import { firstTextCell, lastTextCell, trailGutterCell } from '@/components/molecules/table-gutters'
import { TableHead } from '@lw/ui/components/table'
import { cn } from '@lw/ui/lib/utils'
import type { ReactNode } from 'react'

export const TimeEntriesTableHeader = ({ selectAll }: { selectAll: ReactNode }) => (
  <ListTableHeader select={selectAll}>
    <TableHead className={cn(firstTextCell)}>Zeit</TableHead>
    <TableHead>Termin</TableHead>
    <TableHead className="text-right">Projekt</TableHead>
    <TableHead className={cn('text-right', lastTextCell)}>Dauer</TableHead>
    <TableHead className={cn(trailGutterCell)}><span className="sr-only">Link</span></TableHead>
  </ListTableHeader>
)
