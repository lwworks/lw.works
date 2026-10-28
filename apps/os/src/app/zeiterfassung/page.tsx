import { TimeTrackingPage } from '@/components/pages/time-tracking'
import { getOwnCalendarSync } from '@/lib/db/calendar-sync-states/get-own-calendar-sync'
import { getOwnTimeEntries } from '@/lib/db/time-entries/get-own-time-entries'
import { getSession } from '@/lib/auth/get-session'
import { proxiesThroughProduction } from '@/lib/auth/proxies-through-production'
import { getCurrentIsoWeek } from '@/lib/iso-week/get-current-iso-week'
import { getIsoWeekRange } from '@/lib/iso-week/get-iso-week-range'
import { parseIsoWeek } from '@/lib/iso-week/iso-week'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Zeiterfassung',
}

export const maxDuration = 60

export default async function Page({ searchParams }: PageProps<'/zeiterfassung'>) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { woche } = await searchParams
  const now = new Date()
  const currentWeek = getCurrentIsoWeek(now)
  const week = parseIsoWeek(typeof woche === 'string' ? woche : undefined) ?? currentWeek
  const range = getIsoWeekRange(week)
  const [entries, sync] = await Promise.all([getOwnTimeEntries(range), getOwnCalendarSync()])

  return (
    <TimeTrackingPage
      week={week}
      currentWeek={currentWeek}
      entries={entries}
      sync={sync}
      now={now}
      authProxied={proxiesThroughProduction()}
    />
  )
}
