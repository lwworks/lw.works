import type { CalendarSyncDTO } from '@/lib/db/calendar-sync-states/get-own-calendar-sync'
import type { TimeEntryDTO } from '@/lib/db/time-entries/get-own-time-entries'
import { formatDate, formatDateTime, formatShortDate } from '@/lib/format/format-date-time'
import { formatDuration } from '@/lib/format/format-duration'
import { formatIsoWeek, shiftIsoWeek, type IsoWeek } from '@/lib/iso-week/iso-week'
import { sumTrackedMs } from '@/lib/time-tracking/sum-tracked-ms'
import { Button } from '@lw/ui/components/button'
import { ChevronLeft, ChevronRight, DangerTriangle, Plus } from '@mynaui/icons-react'
import Link from 'next/link'
import { Layout } from '../molecules/layout'
import { PageHeader } from '../molecules/page-header'
import { ConnectCalendarButton } from '../time-tracking/connect-calendar-button'
import { SyncButton } from '../time-tracking/sync-button'
import { TimeEntriesTable } from '../time-tracking/time-entries-table'

type TimeTrackingPageProps = {
  week: IsoWeek
  isCurrentWeek: boolean
  range: { start: Date; end: Date }
  entries: TimeEntryDTO[]
  sync: CalendarSyncDTO
  now: Date
  /** Google sign-in goes through production's OAuth proxy (see `proxiesThroughProduction`). */
  authProxied: boolean
}

export const TimeTrackingPage = ({ week, isCurrentWeek, range, entries, sync, now, authProxied }: TimeTrackingPageProps) => {
  const needsConnect = sync.status === 'reauth_required' || sync.status === 'missing_scope'

  return (
    <Layout>
      <section>
        <PageHeader title="Zeiterfassung" description="Deine Termine aus dem Google Kalender, sobald sie begonnen haben.">
          {needsConnect ? null : <SyncButton />}
          <Button>
            <Plus strokeWidth={1.5} className="size-4" />
            <span>Erfassen</span>
          </Button>
        </PageHeader>
        <div className="px-16 pb-8 flex flex-col gap-6">
          {needsConnect ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
              <div className="flex items-start gap-2">
                <DangerTriangle strokeWidth={1.5} className="size-5 shrink-0" />
                <p>Verbinde deinen Google Kalender, damit deine Termine als Zeiteinträge übernommen werden.</p>
              </div>
              <ConnectCalendarButton proxied={authProxied} />
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon-sm" asChild>
                <Link href={`/zeiterfassung?woche=${formatIsoWeek(shiftIsoWeek(week, -1))}`} aria-label="Vorherige Woche">
                  <ChevronLeft strokeWidth={1.5} />
                </Link>
              </Button>
              <Button variant="outline" size="icon-sm" asChild>
                <Link href={`/zeiterfassung?woche=${formatIsoWeek(shiftIsoWeek(week, 1))}`} aria-label="Nächste Woche">
                  <ChevronRight strokeWidth={1.5} />
                </Link>
              </Button>
              <span className="text-sm font-medium text-black dark:text-white">
                KW {week.week} · {formatShortDate(range.start)}–{formatDate(new Date(range.end.getTime() - 1))}
              </span>
              {isCurrentWeek ? null : (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/zeiterfassung">Heute</Link>
                </Button>
              )}
            </div>
            <div className="text-sm">
              Woche gesamt: <span className="font-medium text-black dark:text-white tabular-nums">{formatDuration(sumTrackedMs(entries, now))}</span>
            </div>
          </div>

          <p className="text-xs">
            {sync.lastSyncedAt ? `Zuletzt synchronisiert: ${formatDateTime(sync.lastSyncedAt)}` : 'Noch nicht synchronisiert.'}
            {sync.status === 'error' ? ' Die letzte Synchronisierung ist fehlgeschlagen.' : null}
          </p>
        </div>
        <TimeEntriesTable key={formatIsoWeek(week)} entries={entries} now={now} />
      </section>
    </Layout>
  )
}
