import type { TimeEntryDTO } from '@/data/time-entries'
import { toZonedDateKey } from '@/lib/week'
import { Button } from '@lw/ui/components/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@lw/ui/components/table'
import { cn } from '@lw/ui/lib/utils'
import { ExternalLink, MapPin, Users } from '@mynaui/icons-react'
import { Fragment } from 'react'
import { EntryDescription } from './entry-description'
import { formatDay, formatDuration, formatTime, getTrackedMs } from './format'

export const TimeEntriesTable = ({ entries, dayKeys, now }: { entries: TimeEntryDTO[]; dayKeys: string[]; now: Date }) => {
  const days = dayKeys
    .map((key) => ({ key, entries: entries.filter((entry) => toZonedDateKey(entry.startAt) === key) }))
    .filter((day) => day.entries.length > 0)

  if (days.length === 0) {
    return <p className="px-16 py-12 text-sm border-t border-neutral-200 dark:border-neutral-800">Keine Einträge in dieser Woche.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-t border-neutral-200 dark:border-neutral-800">
          <TableHead className="pl-16 w-36">Zeit</TableHead>
          <TableHead>Termin</TableHead>
          <TableHead className="text-right w-24">Dauer</TableHead>
          <TableHead className="pr-16 w-16"><span className="sr-only">Link</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {days.map((day) => (
          <Fragment key={day.key}>
            <TableRow className="bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-900">
              <TableCell colSpan={2} className="pl-16 font-medium text-black dark:text-white">{formatDay(day.entries[0].startAt)}</TableCell>
              <TableCell className="text-right font-medium text-black dark:text-white tabular-nums">
                {formatDuration(day.entries.reduce((sum, entry) => sum + getTrackedMs(entry, now), 0))}
              </TableCell>
              <TableCell className="pr-16" />
            </TableRow>
            {day.entries.map((entry) => {
              const running = entry.endAt > now
              return (
                <TableRow key={entry.id}>
                  <TableCell className="pl-16 tabular-nums align-top">
                    {formatTime(entry.startAt)}–{formatTime(entry.endAt)}
                  </TableCell>
                  <TableCell className="whitespace-normal align-top">
                    <div className="font-medium text-black dark:text-white">{entry.title}</div>
                    {entry.description ? <EntryDescription description={entry.description} /> : null}
                    {entry.location || entry.attendeeCount > 0 ? (
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                        {entry.location ? (
                          <span className="inline-flex items-center gap-1 min-w-0">
                            <MapPin strokeWidth={1.5} className="size-3.5 shrink-0" />
                            <span className="truncate max-w-80">{entry.location}</span>
                          </span>
                        ) : null}
                        {entry.attendeeCount > 0 ? (
                          <span className="inline-flex items-center gap-1">
                            <Users strokeWidth={1.5} className="size-3.5" />
                            <span>{entry.attendeeCount} {entry.attendeeCount === 1 ? 'Teilnehmer' : 'Teilnehmende'}</span>
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell className={cn('text-right tabular-nums align-top', running && 'text-black dark:text-white')}>
                    {running ? 'läuft' : formatDuration(getTrackedMs(entry, now))}
                  </TableCell>
                  <TableCell className="pr-16 text-right align-top">
                    {entry.htmlLink ? (
                      <Button variant="ghost" size="icon-xs" asChild>
                        <a href={entry.htmlLink} target="_blank" rel="noreferrer" aria-label="In Google Kalender öffnen">
                          <ExternalLink strokeWidth={1.5} />
                        </a>
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              )
            })}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  )
}
