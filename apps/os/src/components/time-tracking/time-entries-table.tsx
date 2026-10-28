'use client'

import type { TimeEntryDTO } from '@/lib/db/time-entries/get-own-time-entries'
import { formatDay, formatTime } from '@/lib/format/format-date-time'
import { formatDuration } from '@/lib/format/format-duration'
import { toZonedDateKey } from '@/lib/iso-week/to-zoned-date-key'
import { getSelectAllState } from '@/lib/time-tracking/get-select-all-state'
import { sumTrackedMs } from '@/lib/time-tracking/sum-tracked-ms'
import { toggleGroupSelection } from '@/lib/time-tracking/toggle-group-selection'
import { toggleRowSelection } from '@/lib/time-tracking/toggle-row-selection'
import { Button } from '@lw/ui/components/button'
import { Checkbox } from '@lw/ui/components/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@lw/ui/components/table'
import { cn } from '@lw/ui/lib/utils'
import { ExternalLink, MapPin, Users } from '@mynaui/icons-react'
import { Fragment, useState, type MouseEvent } from 'react'

/** Keeps Shift+click from also selecting the text between the clicked checkboxes. */
const preventShiftTextSelection = (event: MouseEvent) => {
  if (event.shiftKey) event.preventDefault()
}

export const TimeEntriesTable = ({ entries, now }: { entries: TimeEntryDTO[]; now: Date }) => {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set())
  const [anchorId, setAnchorId] = useState<string | null>(null)

  if (entries.length === 0) {
    return <p className="px-16 py-12 text-sm border-t border-neutral-200 dark:border-neutral-800">Keine Einträge in dieser Woche.</p>
  }

  const ids = entries.map((entry) => entry.id)
  const selectedCount = ids.filter((id) => selected.has(id)).length
  const days = Map.groupBy(entries, (entry) => toZonedDateKey(entry.startAt))

  const toggleRow = (targetId: string, extendRange: boolean) => {
    setSelected(toggleRowSelection({ ids, selected, anchorId, targetId, extendRange }))
    setAnchorId(targetId)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-t border-neutral-200 dark:border-neutral-800 hover:bg-transparent">
          <TableHead className="pl-16 w-0">
            <Checkbox
              aria-label="Alle Einträge auswählen"
              checked={getSelectAllState(selectedCount, ids.length)}
              onCheckedChange={() => setSelected(new Set(selectedCount === ids.length ? [] : ids))}
            />
          </TableHead>
          <TableHead>Zeit</TableHead>
          <TableHead>Termin</TableHead>
          <TableHead className="text-right">Dauer</TableHead>
          <TableHead className="pr-16 w-0"><span className="sr-only">Link</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...days].map(([day, dayEntries]) => {
          const dayIds = dayEntries.map((entry) => entry.id)
          const dayLabel = formatDay(dayEntries[0].startAt)
          return (
            <Fragment key={day}>
              <TableRow className="bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-900">
                <TableCell className="pl-16">
                  <Checkbox
                    aria-label={`Alle Einträge am ${dayLabel} auswählen`}
                    checked={getSelectAllState(dayIds.filter((id) => selected.has(id)).length, dayIds.length)}
                    onCheckedChange={() => setSelected(toggleGroupSelection({ selected, groupIds: dayIds }))}
                  />
                </TableCell>
                <TableCell colSpan={2} className="font-medium text-black dark:text-white">{dayLabel}</TableCell>
                <TableCell className="text-right font-medium text-black dark:text-white tabular-nums">
                  {formatDuration(sumTrackedMs(dayEntries, now))}
                </TableCell>
                <TableCell className="pr-16" />
              </TableRow>
              {dayEntries.map((entry) => {
                const running = entry.endAt > now
                const isSelected = selected.has(entry.id)
                return (
                  <TableRow key={entry.id} data-state={isSelected ? 'selected' : undefined} className="hover:bg-transparent">
                    <TableCell className="pl-16">
                      <Checkbox
                        aria-label={`${entry.title} auswählen`}
                        checked={isSelected}
                        onMouseDown={preventShiftTextSelection}
                        onClick={(event) => toggleRow(entry.id, event.shiftKey)}
                      />
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {formatTime(entry.startAt)}–{formatTime(entry.endAt)}
                    </TableCell>
                    <TableCell className="w-full max-w-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-medium text-black dark:text-white truncate">{entry.title}</span>
                        {entry.location ? (
                          <span className="inline-flex items-center gap-1 min-w-0 text-xs">
                            <MapPin strokeWidth={1.5} className="size-3.5 shrink-0" />
                            <span className="truncate max-w-60">{entry.location}</span>
                          </span>
                        ) : null}
                        {entry.attendeeCount > 0 ? (
                          <span className="inline-flex items-center gap-1 shrink-0 text-xs" title={`${entry.attendeeCount} ${entry.attendeeCount === 1 ? 'Teilnehmer' : 'Teilnehmende'}`}>
                            <Users strokeWidth={1.5} className="size-3.5" />
                            <span>{entry.attendeeCount}</span>
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className={cn('text-right tabular-nums', running && 'text-black dark:text-white')}>
                      {running ? 'läuft' : formatDuration(sumTrackedMs([entry], now))}
                    </TableCell>
                    <TableCell className="pr-16 text-right">
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
          )
        })}
      </TableBody>
    </Table>
  )
}
