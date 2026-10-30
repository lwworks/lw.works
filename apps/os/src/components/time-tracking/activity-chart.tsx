'use client'

import { formatDate, formatDay } from '@/lib/format/format-date-time'
import { formatDuration } from '@/lib/format/format-duration'
import { isSameIsoWeek } from '@/lib/iso-week/is-same-iso-week'
import { zonedMidnight } from '@/lib/iso-week/zoned-midnight'
import type { ActivityGrid } from '@/lib/time-tracking/build-activity-grid'
import { shiftDateKey } from '@/lib/time-tracking/shift-date-key'
import { Skeleton } from '@lw/ui/components/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@lw/ui/components/tooltip'
import { cn } from '@lw/ui/lib/utils'
import { use, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useWeekNavigation, WeekLink } from './week-navigation'

const LEVEL_CLASSES = ['bg-muted', 'bg-primary/25', 'bg-primary/50', 'bg-primary/75', 'bg-primary']
const WEEKDAYS = ['Mo', '', 'Mi', '', 'Fr', '', 'So']
const ARROW_KEY_DAYS: Record<string, number> = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 }
/** Month label row, then Monday to Sunday. */
const ROWS = 'grid-rows-[1rem_repeat(7,0.75rem)]'

const toDate = (dateKey: string) => zonedMidnight(Date.parse(dateKey))

/**
 * Tracked time per day as week columns, GitHub-contribution style. Each day links to its week; arrow keys move the
 * focus between days, and only one day at a time is in the tab order.
 */
export const ActivityChart = ({ grid }: { grid: Promise<ActivityGrid> }) => {
  const { from, to, weeks, months } = use(grid)
  const { week: shownWeek } = useWeekNavigation()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const cellsRef = useRef(new Map<string, HTMLAnchorElement>())
  const [focusDate, setFocusDate] = useState(to)
  const totalMs = weeks.reduce((sum, { days }) => sum + days.reduce((daySum, day) => daySum + (day?.ms ?? 0), 0), 0)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (scroller) scroller.scrollLeft = scroller.scrollWidth
  }, [])

  const moveFocus = (event: KeyboardEvent) => {
    const days = ARROW_KEY_DAYS[event.key]
    const target = days === undefined ? undefined : cellsRef.current.get(shiftDateKey(focusDate, days))
    if (!target) return
    event.preventDefault()
    target.focus()
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div aria-hidden className={cn('grid gap-[3px] text-[10px] leading-3', ROWS)}>
            {['', ...WEEKDAYS].map((label, row) => (
              <span key={row}>{label}</span>
            ))}
          </div>
          <div ref={scrollerRef} className="min-w-0 overflow-x-auto pb-1">
            <div
              role="group"
              aria-label={`Erfasste Zeit pro Tag seit ${formatDate(toDate(from))}`}
              onKeyDown={moveFocus}
              className={cn('grid w-max grid-flow-col gap-[3px] p-0.5 text-[10px] leading-3', ROWS)}
              style={{ gridTemplateColumns: `repeat(${weeks.length}, 0.75rem)` }}
            >
              {months.map(({ label, column }) => (
                <span key={column} aria-hidden className="whitespace-nowrap" style={{ gridColumn: column + 1, gridRow: 1 }}>
                  {label}
                </span>
              ))}
              {weeks.map(({ week, days }, column) => {
                const shown = isSameIsoWeek(week, shownWeek)
                return [
                  shown ? (
                    <div
                      key={`${column}-shown`}
                      aria-hidden
                      className="-m-0.5 rounded-[4px] ring-1 ring-primary"
                      style={{ gridColumn: column + 1, gridRow: '2 / span 7' }}
                    />
                  ) : null,
                  ...days.map((day, row) => {
                    if (!day) return null
                    const label = `${formatDay(toDate(day.date))}: ${day.ms > 0 ? formatDuration(day.ms) : 'nichts erfasst'}`
                    return (
                      <Tooltip key={day.date}>
                        <TooltipTrigger asChild>
                          <WeekLink
                            week={week}
                            ref={(cell: HTMLAnchorElement | null) => {
                              if (!cell) return
                              cellsRef.current.set(day.date, cell)
                              return () => {
                                cellsRef.current.delete(day.date)
                              }
                            }}
                            tabIndex={day.date === focusDate ? 0 : -1}
                            onFocus={() => setFocusDate(day.date)}
                            aria-label={label}
                            aria-current={shown ? 'true' : undefined}
                            className={cn(
                              'size-3 rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
                              LEVEL_CLASSES[day.level],
                            )}
                            style={{ gridColumn: column + 1, gridRow: row + 2 }}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top">{label}</TooltipContent>
                      </Tooltip>
                    )
                  }),
                ]
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span>
            <span className="font-medium text-black dark:text-white tabular-nums">{formatDuration(totalMs)}</span> erfasst seit{' '}
            {formatDate(toDate(from))}
          </span>
          <div aria-hidden className="flex items-center gap-1">
            <span className="mr-1">weniger</span>
            {LEVEL_CLASSES.map((className) => (
              <span key={className} className={cn('size-3 rounded-[3px]', className)} />
            ))}
            <span className="ml-1">mehr</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

/** Placeholder with the chart's height. */
export const ActivityChartSkeleton = () => {
  return (
    <div aria-busy="true" aria-label="Aktivität wird geladen" className="flex flex-col gap-2">
      <Skeleton className="h-[129px] w-full max-w-[720px]" />
      <Skeleton className="h-4 w-48" />
    </div>
  )
}
