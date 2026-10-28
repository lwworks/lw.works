import { Skeleton } from '@lw/ui/components/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@lw/ui/components/table'
import { cn } from '@lw/ui/lib/utils'
import { Fragment } from 'react'

const DAYS = [3, 2]

/** Placeholder for `TimeEntriesTable` with the same columns and row heights. */
export const TimeEntriesTableSkeleton = () => {
  return (
    <Table aria-busy="true" aria-label="Einträge werden geladen">
      <TableHeader>
        <TableRow className="border-t border-neutral-200 dark:border-neutral-800 hover:bg-transparent">
          <TableHead className="pl-16 w-0">
            <Skeleton className="size-4 rounded-[4px]" />
          </TableHead>
          <TableHead>Zeit</TableHead>
          <TableHead>Termin</TableHead>
          <TableHead className="text-right">Dauer</TableHead>
          <TableHead className="pr-16 w-0"><span className="sr-only">Link</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {DAYS.map((rows, day) => (
          <Fragment key={day}>
            <TableRow className="bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-900">
              <TableCell className="pl-16">
                <Skeleton className="size-4 rounded-[4px]" />
              </TableCell>
              <TableCell colSpan={2}>
                <Skeleton className="h-4 w-48" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12 ml-auto" />
              </TableCell>
              <TableCell className="pr-16" />
            </TableRow>
            {Array.from({ length: rows }, (_, row) => (
              <TableRow key={row} className="hover:bg-transparent">
                <TableCell className="pl-16">
                  <Skeleton className="size-4 rounded-[4px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="w-full max-w-0">
                  <Skeleton className={cn('h-4', row % 2 ? 'w-40' : 'w-64')} />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12 ml-auto" />
                </TableCell>
                <TableCell className="pr-16">
                  <Skeleton className="size-6" />
                </TableCell>
              </TableRow>
            ))}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  )
}
