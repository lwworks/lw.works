'use client'

import { SelectableTableGroupRow, SelectableTableHeader, SelectableTableRow } from '@/components/molecules/selectable-table'
import { firstTextCell, lastTextCell, trailGutterCell, trailGutterInner } from '@/components/molecules/table-gutters'
import { MarkBilledButton, MarkOpenButton } from '@/components/projects/billing-actions'
import { SelectionActionBar } from '@/components/time-tracking/selection-action-bar'
import type { AssignableProject } from '@/lib/db/projects/list-assignable-projects'
import type { ProjectTimeEntriesView, ProjectTimeEntry } from '@/lib/db/time-entries/list-project-time-entries'
import { formatDate, formatDay, formatTime } from '@/lib/format/format-date-time'
import { formatDuration } from '@/lib/format/format-duration'
import { toZonedDateKey } from '@/lib/iso-week/to-zoned-date-key'
import { stripProjectPrefix } from '@/lib/projects/strip-project-prefix'
import { useRowSelection } from '@/lib/selection/use-row-selection'
import { sumTrackedMs } from '@/lib/time-tracking/sum-tracked-ms'
import { Button } from '@lw/ui/components/button'
import { Table, TableBody, TableCell, TableHead } from '@lw/ui/components/table'
import { cn } from '@lw/ui/lib/utils'
import { ExternalLink } from '@mynaui/icons-react'
import { Fragment } from 'react'

/**
 * The project's entries (all, open or billed) by day. All entries can be selected to mark them billed (or open again);
 * reassigning to another project is offered only for the signed-in user's own open entries.
 */
export const ProjectTimeEntriesTable = ({
  entries,
  view,
  projectId,
  projectKey,
  projects,
  now,
}: {
  entries: ProjectTimeEntry[]
  view: ProjectTimeEntriesView
  projectId: string
  projectKey: string
  projects: AssignableProject[]
  now: Date
}) => {
  // Newest day first; entries within a day stay chronological, like the time tracking table.
  const days = [...Map.groupBy(entries, (entry) => toZonedDateKey(entry.startAt))].map(([day, dayEntries]) => [day, [...dayEntries].reverse()] as const)
  // Ids in visual order, so Shift+click ranges match what the user sees.
  const selection = useRowSelection(days.flatMap(([, dayEntries]) => dayEntries.map((entry) => entry.id)))

  if (entries.length === 0) {
    return (
      <p className="px-4 sm:px-8 lg:px-16 py-12 text-sm border-t border-neutral-200 dark:border-neutral-800">
        {{ all: 'Noch keine Zeiteinträge.', open: 'Keine offenen Zeiteinträge.', billed: 'Noch keine abgerechneten Zeiteinträge.' }[view]}
      </p>
    )
  }

  const selectedEntries = entries.filter((entry) => selection.isSelected(entry.id))
  const selectedIds = selection.selectedIds
  const selectedCount = selectedIds.length
  // The invoice column is useless when every row is open.
  const showInvoice = view !== 'open'
  const openIds = selectedEntries.filter((entry) => !entry.billedAt).map((entry) => entry.id)
  const billedIds = selectedEntries.filter((entry) => entry.billedAt).map((entry) => entry.id)
  const clearSelection = selection.clear

  return (
    <>
      <Table className="min-w-xl">
        <SelectableTableHeader selection={selection} label="Alle Einträge auswählen">
          <TableHead className={cn(firstTextCell)}>Zeit</TableHead>
          <TableHead>Termin</TableHead>
          <TableHead>Person</TableHead>
          {showInvoice ? <TableHead>Rechnung</TableHead> : null}
          <TableHead className={cn('text-right', lastTextCell)}>Dauer</TableHead>
          <TableHead className={cn(trailGutterCell)}><span className="sr-only">Link</span></TableHead>
        </SelectableTableHeader>
        <TableBody>
          {days.map(([day, dayEntries]) => {
            const dayIds = dayEntries.map((entry) => entry.id)
            const dayLabel = formatDay(dayEntries[0].startAt)
            return (
              <Fragment key={day}>
                <SelectableTableGroupRow selection={selection} ids={dayIds} label={`Einträge am ${dayLabel} auswählen`}>
                  <TableCell colSpan={showInvoice ? 4 : 3} className={cn('font-medium text-black dark:text-white', firstTextCell)}>{dayLabel}</TableCell>
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
                        <span className="block truncate font-medium text-black dark:text-white">{stripProjectPrefix(entry.title, projectKey)}</span>
                      </TableCell>
                      <TableCell>{entry.userName}</TableCell>
                      {showInvoice ? (
                        <TableCell className="tabular-nums">
                          {entry.invoiceNumber ? <span className="text-black dark:text-white">{entry.invoiceNumber}</span> : null}
                          {entry.invoiceNumber ? ' · ' : null}
                          {entry.billedAt ? formatDate(entry.billedAt) : null}
                        </TableCell>
                      ) : null}
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
      {selectedCount > 0 ? (
        <SelectionActionBar
          selectedIds={selectedIds}
          projects={projects}
          onDone={clearSelection}
          durationMs={sumTrackedMs(selectedEntries, now)}
          // Billed entries keep their project, and only own entries can be moved.
          assignable={billedIds.length === 0 && selectedEntries.every((entry) => entry.isOwn)}
        >
          {billedIds.length > 0 ? <MarkOpenButton projectId={projectId} ids={billedIds} onDone={clearSelection} /> : null}
          {openIds.length > 0 ? <MarkBilledButton projectId={projectId} ids={openIds} onDone={clearSelection} /> : null}
        </SelectionActionBar>
      ) : null}
    </>
  )
}
