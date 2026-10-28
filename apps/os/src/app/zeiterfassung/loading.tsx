import { TimeTrackingPageSkeleton } from '@/components/pages/time-tracking'

/** Shown when entering Zeiterfassung; switching weeks (`?woche=`) keeps the page and shows `WeekPending` instead. */
export default function Loading() {
  return <TimeTrackingPageSkeleton />
}
