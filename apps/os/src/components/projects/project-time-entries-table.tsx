'use client'

import { firstTextCell, lastTextCell, leadGutterCell, leadGutterInner, trailGutterCell, trailGutterInner } from '@/components/molecules/table-gutters'
import { SelectionActionBar } from '@/components/time-tracking/selection-action-bar'
import type { AssignableProject } from '@/lib/db/projects/list-assignable-projects'
import type { ProjectTimeEntry } from '@/lib/db/time-entries/list-project-time-entries'
import { formatDay, formatTime } from '@/lib/format/format-date-time'
import { formatDuration } from '@/lib/format/format-duration'
import { toZonedDateKey } from '@/lib/iso-week/to-zoned-date-key'
import { stripProjectPrefix } from '@/lib/projects/strip-project-prefix'
import { getSelectAllState } from '@/lib/time-tracking/get-select-all-state'
import { sumTrackedMs } from '@/lib/time-tracking/sum-tracked-ms'
import { toggleGroupSelection } from '@/lib/time-tracking/toggle-group-selection'
import { toggleRowSelection } from '@/lib/time-tracking/toggle-row-selection'
import { Button } from '@lw/ui/components/button'
import { Checkbox } from '@lw/ui/components/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@lw/ui/components/table'
import { cn } from '@lw/ui/lib/utils'
import { ExternalLink } from '@mynaui/icons-react'
import { Fragment, useState, type MouseEvent } from 'react'

/** Keeps Shift+click from also selecting the text between the clicked checkboxes. */
const preventShiftTextSelection = (event: MouseEvent) => {
  if (event.shiftKey) event.preventDefault()
}

/** The project's entries by day. Only the signed-in user's own entries can be selected and reassigned. */
export const ProjectTimeEntriesTable = ({
  entries,
  projectKey,
  projects,
  now,
}: {
  entries: ProjectTimeEntry[]
  projectKey: string
  projects: AssignableProject[]
  now: Date
}) => {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set())
  const [anchorId, setAnchorId] = useState<string | null>(null)

  if (entries.length === 0) {
    return <p className="px-4 sm:px-8 lg:px-16 py-12 text-sm border-t border-neutral-200 dark:border-neutral-800">Noch keine Zeiteinträge.</p>
  }

  // Newest day first; entries within a day stay chronological, like the time tracking table.
  const days = [...Map.groupBy(entries, (entry) => toZonedDateKey(entry.startAt))].map(([day, dayEntries]) => [day, [...dayEntries].reverse()] as const)
  // Selectable ids in visual order, so Shift+click ranges match what the user sees.
  const ids = days.flatMap(([, dayEntries]) => dayEntries.flatMap((entry) => (entry.isOwn ? [entry.id] : [])))
  const selectedCount = ids.filter((id) => selected.has(id)).length

  const toggleRow = (targetId: string, extendRange: boolean) => {
    setSelected(toggleRowSelection({ ids, selected, anchorId, targetId, extendRange }))
    setAnchorId(targetId)
  }

  return (
    <>
      <Table className="min-w-xl">
        <TableHeader>
          <TableRow className="border-t border-neutral-200 dark:border-neutral-800 hover:bg-transparent">
            <TableHead className={cn(leadGutterCell)}>
              <div className={cn(leadGutterInner)}>
                <Checkbox
                  aria-label="Alle eigenen Einträge auswählen"
                  checked={getSelectAllState(selectedCount, ids.length)}
                  disabled={ids.length === 0}
                  onCheckedChange={() => setSelected(new Set(selectedCount === ids.length ? [] : ids))}
                />
              </div>
            </TableHead>
            <TableHead className={cn(firstTextCell)}>Zeit</TableHead>
            <TableHead>Termin</TableHead>
            <TableHead>Person</TableHead>
            <TableHead className={cn('text-right', lastTextCell)}>Dauer</TableHead>
            <TableHead className={cn(trailGutterCell)}><span className="sr-only">Link</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {days.map(([day, dayEntries]) => {
            const dayIds = dayEntries.flatMap((entry) => (entry.isOwn ? [entry.id] : []))
            const dayLabel = formatDay(dayEntries[0].startAt)
            return (
              <Fragment key={day}>
                <TableRow className="bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-900">
                  <TableCell className={cn(leadGutterCell)}>
                    <div className={cn(leadGutterInner)}>
                      <Checkbox
                        aria-label={`Eigene Einträge am ${dayLabel} auswählen`}
                        checked={getSelectAllState(dayIds.filter((id) => selected.has(id)).length, dayIds.length)}
                        disabled={dayIds.length === 0}
                        onCheckedChange={() => setSelected(toggleGroupSelection({ selected, groupIds: dayIds }))}
                      />
                    </div>
                  </TableCell>
                  <TableCell colSpan={3} className={cn('font-medium text-black dark:text-white', firstTextCell)}>{dayLabel}</TableCell>
                  <TableCell className={cn('text-right font-medium text-black dark:text-white tabular-nums', lastTextCell)}>
                    {formatDuration(sumTrackedMs(dayEntries, now))}
                  </TableCell>
                  <TableCell className={cn(trailGutterCell)} />
                </TableRow>
                {dayEntries.map((entry) => {
                  const running = entry.endAt > now
                  const isSelected = selected.has(entry.id)
                  return (
                    <TableRow key={entry.id} data-state={isSelected ? 'selected' : undefined} className="hover:bg-transparent">
                      <TableCell className={cn(leadGutterCell)}>
                        <div className={cn(leadGutterInner)} title={entry.isOwn ? undefined : 'Nur eigene Einträge lassen sich zuordnen.'}>
                          <Checkbox
                            aria-label={`${entry.title} auswählen`}
                            checked={isSelected}
                            disabled={!entry.isOwn}
                            onMouseDown={preventShiftTextSelection}
                            onClick={(event) => toggleRow(entry.id, event.shiftKey)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className={cn('tabular-nums', firstTextCell)}>
                        {formatTime(entry.startAt)}–{formatTime(entry.endAt)}
                      </TableCell>
                      <TableCell className="w-full max-w-0">
                        <span className="block truncate font-medium text-black dark:text-white">{stripProjectPrefix(entry.title, projectKey)}</span>
                      </TableCell>
                      <TableCell>{entry.userName}</TableCell>
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
                    </TableRow>
                  )
                })}
              </Fragment>
            )
          })}
        </TableBody>
      </Table>
      {selectedCount > 0 ? (
        <SelectionActionBar selectedIds={ids.filter((id) => selected.has(id))} projects={projects} onDone={() => setSelected(new Set())} />
      ) : null}
    </>
  )
}
