import type { CalendarSyncDTO } from '@/lib/db/calendar-sync-states/get-own-calendar-sync'
import type { TimeEntryDTO } from '@/lib/db/time-entries/get-own-time-entries'
import { formatDateTime } from '@/lib/format/format-date-time'
import { formatDuration } from '@/lib/format/format-duration'
import { formatIsoWeek, type IsoWeek } from '@/lib/iso-week/iso-week'
import { sumTrackedMs } from '@/lib/time-tracking/sum-tracked-ms'
import { Button } from '@lw/ui/components/button'
import { Skeleton } from '@lw/ui/components/skeleton'
import { DangerTriangle, Plus } from '@mynaui/icons-react'
import { Layout } from '../molecules/layout'
import { PageHeader } from '../molecules/page-header'
import { ConnectCalendarButton } from '../time-tracking/connect-calendar-button'
import { SyncButton } from '../time-tracking/sync-button'
import { TimeEntriesTable } from '../time-tracking/time-entries-table'
import { TimeEntriesTableSkeleton } from '../time-tracking/time-entries-table-skeleton'
import { WeekNavigation, WeekNavigationProvider, WeekPending } from '../time-tracking/week-navigation'

const title = 'Zeiterfassung'
const description = 'Deine Termine aus dem Google Kalender, sobald sie begonnen haben.'

const CreateEntryButton = () => {
  return (
    <Button>
      <Plus strokeWidth={1.5} className="size-4" />
      <span>Erfassen</span>
    </Button>
  )
}

type TimeTrackingPageProps = {
  week: IsoWeek
  currentWeek: IsoWeek
  entries: TimeEntryDTO[]
  sync: CalendarSyncDTO
  now: Date
  /** Google sign-in goes through production's OAuth proxy (see `proxiesThroughProduction`). */
  authProxied: boolean
}

export const TimeTrackingPage = ({ week, currentWeek, entries, sync, now, authProxied }: TimeTrackingPageProps) => {
  const needsConnect = sync.status === 'reauth_required' || sync.status === 'missing_scope'

  return (
    <Layout>
      <section>
        <PageHeader title={title} description={description}>
          {needsConnect ? null : <SyncButton />}
          <CreateEntryButton />
        </PageHeader>
        <WeekNavigationProvider week={week} currentWeek={currentWeek}>
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
              <WeekNavigation />
              <div className="flex items-center gap-1 text-sm">
                Woche gesamt:
                <WeekPending fallback={<Skeleton className="h-4 w-12" />}>
                  <span className="font-medium text-black dark:text-white tabular-nums">{formatDuration(sumTrackedMs(entries, now))}</span>
                </WeekPending>
              </div>
            </div>

            <p className="text-xs">
              {sync.lastSyncedAt ? `Zuletzt synchronisiert: ${formatDateTime(sync.lastSyncedAt)}` : 'Noch nicht synchronisiert.'}
              {sync.status === 'error' ? ' Die letzte Synchronisierung ist fehlgeschlagen.' : null}
            </p>
          </div>
          <WeekPending fallback={<TimeEntriesTableSkeleton />}>
            <TimeEntriesTable key={formatIsoWeek(week)} entries={entries} now={now} />
          </WeekPending>
        </WeekNavigationProvider>
      </section>
    </Layout>
  )
}

export const TimeTrackingPageSkeleton = () => {
  return (
    <Layout>
      <section aria-busy="true">
        <PageHeader title={title} description={description}>
          <Skeleton className="h-9 w-20" />
          <CreateEntryButton />
        </PageHeader>
        <div className="px-16 pb-8 flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="size-7" />
              <Skeleton className="size-7" />
              <Skeleton className="h-4 w-44" />
            </div>
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-4 w-56" />
        </div>
        <TimeEntriesTableSkeleton />
      </section>
    </Layout>
  )
}
