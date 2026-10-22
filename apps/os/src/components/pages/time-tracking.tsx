import type { CalendarSyncDTO, TimeEntryDTO } from '@/data/time-entries'
import { formatIsoWeek, type IsoWeek } from '@/lib/week'
import { Heading } from '@lw/ui/atoms/heading'
import { Button } from '@lw/ui/components/button'
import { ChevronLeft, ChevronRight, DangerTriangle } from '@mynaui/icons-react'
import Link from 'next/link'
import { Layout } from '../molecules/layout'
import { ConnectCalendarButton } from '../time-tracking/connect-calendar-button'
import { formatDate, formatDateTime, formatDuration, formatShortDate, getTrackedMs } from '../time-tracking/format'
import { SyncButton } from '../time-tracking/sync-button'
import { TimeEntriesTable } from '../time-tracking/time-entries-table'

export type TimeTrackingPageProps = {
  week: IsoWeek
  previousWeek: IsoWeek
  nextWeek: IsoWeek
  isCurrentWeek: boolean
  range: { start: Date; end: Date; dayKeys: string[] }
  entries: TimeEntryDTO[]
  sync: CalendarSyncDTO
  now: Date
}

const syncNotices: Partial<Record<CalendarSyncDTO['status'], string>> = {
  not_connected: 'Verbinde deinen Google Kalender, damit deine Termine als Zeiteinträge übernommen werden.',
  reauth_required: 'Der Zugriff auf deinen Google Kalender ist abgelaufen oder wurde widerrufen. Bitte verbinde ihn erneut.',
  missing_scope: 'Die Berechtigung für deinen Google Kalender fehlt. Bitte verbinde ihn erneut.',
}

export const TimeTrackingPage = ({ week, previousWeek, nextWeek, isCurrentWeek, range, entries, sync, now }: TimeTrackingPageProps) => {
  const notice = syncNotices[sync.status]
  const weekEnd = new Date(range.end.getTime() - 1)
  const weekTotal = entries.reduce((sum, entry) => sum + getTrackedMs(entry, now), 0)

  return (
    <Layout>
      <section>
        <div className="px-16 py-8 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Heading as="h1" size="h3">Zeiterfassung</Heading>
              <p className="text-sm mt-1">Deine Termine aus dem Google Kalender, sobald sie begonnen haben.</p>
            </div>
            {notice ? null : <SyncButton />}
          </div>

          {notice ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
              <div className="flex items-start gap-2">
                <DangerTriangle strokeWidth={1.5} className="size-5 shrink-0" />
                <p>{notice}</p>
              </div>
              <ConnectCalendarButton />
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon-sm" asChild>
                <Link href={`/zeiterfassung?woche=${formatIsoWeek(previousWeek)}`} aria-label="Vorherige Woche">
                  <ChevronLeft strokeWidth={1.5} />
                </Link>
              </Button>
              <Button variant="outline" size="icon-sm" asChild>
                <Link href={`/zeiterfassung?woche=${formatIsoWeek(nextWeek)}`} aria-label="Nächste Woche">
                  <ChevronRight strokeWidth={1.5} />
                </Link>
              </Button>
              <span className="text-sm font-medium text-black dark:text-white">
                KW {week.week} · {formatShortDate(range.start)}–{formatDate(weekEnd)}
              </span>
              {isCurrentWeek ? null : (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/zeiterfassung">Heute</Link>
                </Button>
              )}
            </div>
            <div className="text-sm">
              Woche gesamt: <span className="font-medium text-black dark:text-white tabular-nums">{formatDuration(weekTotal)}</span>
            </div>
          </div>

          <p className="text-xs">
            {sync.lastSyncedAt ? `Zuletzt synchronisiert: ${formatDateTime(sync.lastSyncedAt)}` : 'Noch nicht synchronisiert.'}
            {sync.status === 'error' ? ' Die letzte Synchronisierung ist fehlgeschlagen.' : null}
          </p>
        </div>
        <TimeEntriesTable entries={entries} dayKeys={range.dayKeys} now={now} />
      </section>
    </Layout>
  )
}
