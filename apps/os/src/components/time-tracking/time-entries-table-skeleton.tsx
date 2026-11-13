import { Skeleton } from '@lw/ui/components/skeleton'
import { Table, TableBody, TableCell, TableRow } from '@lw/ui/components/table'
import { cn } from '@lw/ui/lib/utils'
import { Fragment } from 'react'
import { firstTextCell, lastTextCell, leadGutterCell, leadGutterInner, trailGutterCell, trailGutterInner } from '@/components/molecules/table-gutters'
import { TimeEntriesTableHeader } from './time-entries-table-header'

const DAYS = [3, 2]

/** Placeholder for `TimeEntriesTable` with the same columns and row heights. */
export const TimeEntriesTableSkeleton = () => {
  return (
    <Table className="min-w-xl" aria-busy="true" aria-label="Einträge werden geladen">
      <TimeEntriesTableHeader selectAll={<Skeleton className="size-4 rounded-[4px]" />} />
      <TableBody>
        {DAYS.map((rows, day) => (
          <Fragment key={day}>
            <TableRow className="bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-900">
              <TableCell className={cn(leadGutterCell)}>
                <div className={cn(leadGutterInner)}>
                  <Skeleton className="size-4 rounded-[4px]" />
                </div>
              </TableCell>
              <TableCell colSpan={3} className={cn(firstTextCell)}>
                <Skeleton className="h-4 w-48" />
              </TableCell>
              <TableCell className={cn(lastTextCell)}>
                <Skeleton className="h-4 w-12 ml-auto" />
              </TableCell>
              <TableCell className={cn(trailGutterCell)} />
            </TableRow>
            {Array.from({ length: rows }, (_, row) => (
              <TableRow key={row} className="hover:bg-transparent">
                <TableCell className={cn(leadGutterCell)}>
                  <div className={cn(leadGutterInner)}>
                    <Skeleton className="size-4 rounded-[4px]" />
                  </div>
                </TableCell>
                <TableCell className={cn(firstTextCell)}>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="w-full max-w-0">
                  <Skeleton className={cn('h-4', row % 2 ? 'w-40' : 'w-64')} />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16 ml-auto rounded-full" />
                </TableCell>
                <TableCell className={cn(lastTextCell)}>
                  <Skeleton className="h-4 w-12 ml-auto" />
                </TableCell>
                <TableCell className={cn(trailGutterCell)}>
                  <div className={cn(trailGutterInner)}>
                    <Skeleton className="size-6" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  )
}
