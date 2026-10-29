import { TableHead, TableHeader, TableRow } from '@lw/ui/components/table'
import type { ReactNode } from 'react'

export const TimeEntriesTableHeader = ({ selectAll }: { selectAll: ReactNode }) => {
  return (
    <TableHeader>
      <TableRow className="border-t border-neutral-200 dark:border-neutral-800 hover:bg-transparent">
        <TableHead className="pl-16 w-0">{selectAll}</TableHead>
        <TableHead>Zeit</TableHead>
        <TableHead>Termin</TableHead>
        <TableHead className="text-right">Dauer</TableHead>
        <TableHead className="pr-16 w-0"><span className="sr-only">Link</span></TableHead>
      </TableRow>
    </TableHeader>
  )
}
