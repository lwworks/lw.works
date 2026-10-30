'use client'

import { createContext, use, type ReactNode } from 'react'

const ActivityChartSlotContext = createContext<ReactNode>(null)

/**
 * Hands the chart rendered by `zeiterfassung/layout.tsx` to the page. Layouts don't re-render when only `?woche=`
 * changes, so switching weeks neither refetches nor re-suspends the chart.
 */
export const ActivityChartSlotProvider = ({ chart, children }: { chart: ReactNode; children: ReactNode }) => {
  return <ActivityChartSlotContext value={chart}>{children}</ActivityChartSlotContext>
}

export const ActivityChartSlot = () => use(ActivityChartSlotContext)
