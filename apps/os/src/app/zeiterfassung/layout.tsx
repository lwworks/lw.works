import { ActivityChart, ActivityChartSkeleton } from '@/components/time-tracking/activity-chart'
import { ActivityChartSlotProvider } from '@/components/time-tracking/activity-chart-slot'
import { getOwnActivityGrid } from '@/lib/time-tracking/get-own-activity-grid'
import { Suspense } from 'react'

export default function Layout({ children }: LayoutProps<'/zeiterfassung'>) {
  const chart = (
    <Suspense fallback={<ActivityChartSkeleton />}>
      <ActivityChart grid={getOwnActivityGrid(new Date())} />
    </Suspense>
  )
  return <ActivityChartSlotProvider chart={chart}>{children}</ActivityChartSlotProvider>
}
