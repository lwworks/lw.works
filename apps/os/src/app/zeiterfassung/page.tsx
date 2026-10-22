import { TimeTrackingPage } from '@/components/pages/time-tracking'
import { getOwnCalendarSync, getOwnTimeEntries } from '@/data/time-entries'
import { getSession } from '@/lib/auth'
import { formatIsoWeek, getCurrentIsoWeek, getIsoWeekRange, parseIsoWeek } from '@/lib/week'
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
      isCurrentWeek={formatIsoWeek(week) === formatIsoWeek(currentWeek)}
      range={range}
      entries={entries}
      sync={sync}
      now={now}
    />
  )
}
