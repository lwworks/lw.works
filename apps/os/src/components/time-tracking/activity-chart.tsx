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
import { use, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useWeekNavigation, WeekLink } from './week-navigation'

/** Empty, then ≤2 h, ≤4 h, ≤6 h, ≤8 h, and solid primary for >8 h. */
const LEVEL_CLASSES = ['bg-muted', 'bg-primary/20', 'bg-primary/40', 'bg-primary/60', 'bg-primary/75', 'bg-primary']
const WEEKDAYS = ['Mo', '', 'Mi', '', 'Fr', '', 'So']
const ARROW_KEY_DAYS: Record<string, number> = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 }
/** Month labels, Monday–Sunday, then the week marker. Columns grow to fill the row and scroll below 10px. */
const ROWS = '1rem repeat(7, 0.75rem) 0.5rem'
const CELL = 'block size-full rounded-[3px]'

const toDate = (dateKey: string) => zonedMidnight(Date.parse(dateKey))

/**
 * Tracked time per day as week columns, GitHub-contribution style, through the end of the current year. Days after
 * today are visible but not links, so a future week cannot be opened from the chart.
 */
export const ActivityChart = ({ grid }: { grid: Promise<ActivityGrid> }) => {
  const { from, today, weeks, months } = use(grid)
  const { week: shownWeek, currentWeek } = useWeekNavigation()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const currentWeekRef = useRef<HTMLSpanElement>(null)
  const cellsRef = useRef(new Map<string, HTMLAnchorElement>())
  const [focusDate, setFocusDate] = useState(today)

  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    const marker = currentWeekRef.current
    if (!scroller || !marker || scroller.scrollWidth <= scroller.clientWidth + 1) return
    scroller.scrollLeft += marker.getBoundingClientRect().right - scroller.getBoundingClientRect().right + 4
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
      <div ref={scrollerRef} className="overflow-x-auto pb-1">
        <div
          role="group"
          aria-label={`Erfasste Zeit pro Tag seit ${formatDate(toDate(from))}`}
          onKeyDown={moveFocus}
          className="grid w-full min-w-min gap-[3px] p-0.5 text-[10px] leading-3"
          style={{ gridTemplateColumns: `auto repeat(${weeks.length}, minmax(0.625rem, 1fr))`, gridTemplateRows: ROWS }}
        >
          <span aria-hidden className="sticky left-0 z-10 bg-background" style={{ gridColumn: 1, gridRow: 1 }} />
          {WEEKDAYS.map((label, row) => (
            <span
              key={`weekday-${row}`}
              aria-hidden
              className="sticky left-0 z-10 flex items-center bg-background pr-1 shadow-[3px_0_0_0_var(--background)]"
              style={{ gridColumn: 1, gridRow: row + 2 }}
            >
              {label}
            </span>
          ))}
          {weeks.flatMap(({ week, days }, column) => {
            const isCurrent = isSameIsoWeek(week, currentWeek)
            const isShown = isSameIsoWeek(week, shownWeek)
            const gridColumn = column + 2
            return [
              ...days.map((day, row) => {
                if (!day) return null
                const style = { gridColumn, gridRow: row + 2 }
                const label = `${formatDay(toDate(day.date))}: ${day.ms > 0 ? formatDuration(day.ms) : 'nichts erfasst'}`
                if (day.date > today) {
                  return <span key={day.date} aria-hidden className={cn(CELL, LEVEL_CLASSES[day.level])} style={style} />
                }
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
                        aria-current={isShown ? 'true' : undefined}
                        className={cn(
                          CELL,
                          'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
                          LEVEL_CLASSES[day.level],
                        )}
                        style={style}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top">{label}</TooltipContent>
                  </Tooltip>
                )
              }),
              isCurrent || isShown ? (
                <span
                  key={`${column}-mark`}
                  ref={isCurrent ? currentWeekRef : undefined}
                  aria-hidden
                  className="flex items-center justify-center"
                  style={{ gridColumn, gridRow: 9 }}
                >
                  <span
                    className={cn(
                      'rounded-full',
                      isCurrent ? 'size-1.5 bg-black dark:bg-white' : 'size-1 bg-black/30 dark:bg-white/40',
                    )}
                  />
                </span>
              ) : null,
            ]
          })}
          {months.map(({ label, column }) => (
            <span key={`month-${column}`} aria-hidden className="whitespace-nowrap" style={{ gridColumn: column + 2, gridRow: 1 }}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}

/** Placeholder with the chart's height. */
export const ActivityChartSkeleton = () => {
  return (
    <div aria-busy="true" aria-label="Aktivität wird geladen">
      <Skeleton className="h-[136px] w-full" />
    </div>
  )
}
