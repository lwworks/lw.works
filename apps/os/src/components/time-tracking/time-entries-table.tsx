'use client'

import { CompanyIcon } from '@/components/atoms/company-icon'
import type { AssignableProject } from '@/lib/db/projects/list-assignable-projects'
import type { TimeEntryDTO } from '@/lib/db/time-entries/get-own-time-entries'
import { formatDay, formatTime } from '@/lib/format/format-date-time'
import { formatDuration } from '@/lib/format/format-duration'
import { toZonedDateKey } from '@/lib/iso-week/to-zoned-date-key'
import { stripProjectPrefix } from '@/lib/projects/strip-project-prefix'
import { sumTrackedMs } from '@/lib/time-tracking/sum-tracked-ms'
import { useRowSelection } from '@/lib/selection/use-row-selection'
import { Button } from '@lw/ui/components/button'
import { Checkbox } from '@lw/ui/components/checkbox'
import { Table, TableBody, TableCell } from '@lw/ui/components/table'
import { cn } from '@lw/ui/lib/utils'
import { ExternalLink, MapPin, Users } from '@mynaui/icons-react'
import Link from 'next/link'
import { Fragment } from 'react'
import { SelectionActionBar } from './selection-action-bar'
import { SelectableTableGroupRow, SelectableTableRow } from '@/components/molecules/selectable-table'
import { firstTextCell, lastTextCell, trailGutterCell, trailGutterInner } from '@/components/molecules/table-gutters'
import { TimeEntriesTableHeader } from './time-entries-table-header'

export const TimeEntriesTable = ({ entries, projects, now }: { entries: TimeEntryDTO[]; projects: AssignableProject[]; now: Date }) => {
  // Newest day first; entries within a day stay chronological (morning to evening).
  const days = [...Map.groupBy(entries, (entry) => toZonedDateKey(entry.startAt))].reverse()
  // Visual order, so Shift+click ranges match what the user sees.
  const selection = useRowSelection(days.flatMap(([, dayEntries]) => dayEntries.map((entry) => entry.id)))

  if (entries.length === 0) {
    return <p className="px-4 sm:px-8 lg:px-16 py-12 text-sm border-t border-neutral-200 dark:border-neutral-800">Keine Einträge in dieser Woche.</p>
  }

  return (
    <>
    <Table className="min-w-xl">
      <TimeEntriesTableHeader
        selectAll={
          <Checkbox aria-label="Alle Einträge auswählen" checked={selection.allState} onCheckedChange={selection.toggleAll} />
        }
      />
      <TableBody>
        {days.map(([day, dayEntries]) => {
          const dayIds = dayEntries.map((entry) => entry.id)
          const dayLabel = formatDay(dayEntries[0].startAt)
          return (
            <Fragment key={day}>
              <SelectableTableGroupRow selection={selection} ids={dayIds} label={`Alle Einträge am ${dayLabel} auswählen`}>
                <TableCell colSpan={3} className={cn('font-medium text-black dark:text-white', firstTextCell)}>{dayLabel}</TableCell>
                <TableCell className={cn('text-right font-medium text-black dark:text-white tabular-nums', lastTextCell)}>
                  {formatDuration(sumTrackedMs(dayEntries, now))}
                </TableCell>
                <TableCell className={cn(trailGutterCell)} />
              </SelectableTableGroupRow>
              {dayEntries.map((entry) => {
                const running = entry.endAt > now
                return (
                  <SelectableTableRow key={entry.id} selection={selection} id={entry.id} label={`${entry.title} auswählen`}>
                    <TableCell className={cn('tabular-nums', firstTextCell)}>
                      {formatTime(entry.startAt)}–{formatTime(entry.endAt)}
                    </TableCell>
                    <TableCell className="w-full max-w-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-medium text-black dark:text-white truncate">{stripProjectPrefix(entry.title, entry.project?.key)}</span>
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
                    <TableCell>
                      <div className="flex justify-end">
                        {entry.project ? (
                          <Link
                            href={`/projekte/${entry.project.slug}`}
                            title={entry.projectAssignment === 'manual' ? `${entry.project.title} (manuell zugeordnet)` : entry.project.title}
                            className="inline-flex h-6 items-center gap-1.5 rounded-full border pr-2 pl-1.5 hover:bg-neutral-100 hover:text-black dark:hover:bg-neutral-900 dark:hover:text-white"
                          >
                            <CompanyIcon companyId={entry.project.companyId} logoKey={entry.projectLogoKey} />
                            <span className="truncate">{entry.project.key}</span>
                          </Link>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className={cn('text-right tabular-nums', lastTextCell, running && 'text-black dark:text-white')}>
                      {running ? 'läuft' : formatDuration(sumTrackedMs([entry], now))}
                    </TableCell>
                    <TableCell className={cn(trailGutterCell)}>
                      <div className={cn(trailGutterInner)}>
                        {entry.htmlLink ? (
                          <Button variant="ghost" size="icon-xs" asChild>
                            <a href={entry.htmlLink} target="_blank" rel="noreferrer" aria-label="In Google Kalender öffnen">
                              <ExternalLink strokeWidth={1.5} />
                            </a>
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </SelectableTableRow>
                )
              })}
            </Fragment>
          )
        })}
      </TableBody>
    </Table>
    {selection.selectedIds.length > 0 ? (
      <SelectionActionBar selectedIds={selection.selectedIds} projects={projects} onDone={selection.clear} />
    ) : null}
    </>
  )
}
