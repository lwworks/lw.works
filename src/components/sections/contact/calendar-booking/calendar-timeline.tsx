'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Spinner } from '@mynaui/icons-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type AvailableSlot = {
  start: string
  end: string
}

type DaySlots = {
  date: string
  displayDate: string
  displayWeekday: string
  slots: AvailableSlot[]
}

const REM_PER_HOUR = 3.5

const TIMEZONES = [
  'Pacific/Midway',       // UTC-11
  'Pacific/Honolulu',     // UTC-10
  'America/Anchorage',    // UTC-9
  'America/Los_Angeles',  // UTC-8
  'America/Denver',       // UTC-7
  'America/Chicago',      // UTC-6
  'America/New_York',     // UTC-5
  'America/Sao_Paulo',    // UTC-3
  'Atlantic/Cape_Verde',  // UTC-1
  'Europe/London',        // UTC+0
  'Europe/Berlin',        // UTC+1
  'Europe/Helsinki',      // UTC+2
  'Europe/Moscow',        // UTC+3
  'Asia/Dubai',           // UTC+4
  'Asia/Karachi',         // UTC+5
  'Asia/Kolkata',         // UTC+5:30
  'Asia/Dhaka',           // UTC+6
  'Asia/Bangkok',         // UTC+7
  'Asia/Shanghai',        // UTC+8
  'Asia/Tokyo',           // UTC+9
  'Australia/Sydney',     // UTC+10
  'Pacific/Auckland',     // UTC+12
]

function formatTime(iso: string, timezone: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone
  }).format(new Date(iso))
}

function getHoursInTimezone(iso: string, timezone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone: timezone
  }).formatToParts(new Date(iso))
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0)
  return hour + minute / 60
}

function regroupSlotsByTimezone(days: DaySlots[], timezone: string): DaySlots[] {
  const allSlots = days.flatMap((d) => d.slots)
  const grouped = new Map<string, AvailableSlot[]>()

  const dateFormatter = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'short', timeZone: timezone })
  const weekdayFormatter = new Intl.DateTimeFormat('de-DE', { weekday: 'short', timeZone: timezone })

  for (const slot of allSlots) {
    const dateKey = new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(new Date(slot.start))
    if (!grouped.has(dateKey)) grouped.set(dateKey, [])
    grouped.get(dateKey)!.push(slot)
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, slots]) => {
      const refDate = new Date(slots[0].start)
      return {
        date,
        displayDate: dateFormatter.format(refDate),
        displayWeekday: weekdayFormatter.format(refDate),
        slots: slots.sort((a, b) => a.start.localeCompare(b.start))
      }
    })
}

export type CalendarTimelineProps = {
  teamMemberSlug: string
  advanceDays: number
}

export const CalendarTimeline = ({ teamMemberSlug, advanceDays }: CalendarTimelineProps) => {
  const [rawDays, setRawDays] = useState<DaySlots[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null)
  const [timezone, setTimezone] = useState(() => {
    const browser = Intl.DateTimeFormat().resolvedOptions().timeZone
    return TIMEZONES.includes(browser) ? browser : 'Europe/Berlin'
  })

  const days = useMemo(() => regroupSlotsByTimezone(rawDays, timezone), [rawDays, timezone])
  const timelineRef = useRef<HTMLDivElement>(null)

  const fetchSlots = useCallback(async () => {
    setLoading(true)
    const from = new Date()
    const to = new Date(from)
    to.setDate(to.getDate() + advanceDays)

    const params = new URLSearchParams({
      member: teamMemberSlug,
      from: from.toISOString().split('T')[0],
      to: to.toISOString().split('T')[0]
    })

    try {
      const res = await fetch(`/api/availability?${params}`)
      if (res.ok) {
        const data: DaySlots[] = await res.json()
        setRawDays(data)
      }
    } finally {
      setLoading(false)
    }
  }, [teamMemberSlug, advanceDays])

  useEffect(() => {
    fetchSlots()
  }, [fetchSlots])

  useEffect(() => {
    const firstWithSlots = days.findIndex((d) => d.slots.length > 0)
    if (firstWithSlots !== -1) {
      setSelectedDayIndex(firstWithSlots)
      setSelectedSlot(null)
    }
  }, [days])

  const currentDay = days[selectedDayIndex]

  useEffect(() => {
    const container = timelineRef.current
    if (!container) return
    const firstSlot = currentDay?.slots[0]
    if (firstSlot) {
      const startHours = getHoursInTimezone(firstSlot.start, timezone)
      const scrollTarget = (1 + startHours * REM_PER_HOUR) * 16 - 32
      container.scrollTo({ top: Math.max(0, scrollTarget), behavior: 'smooth' })
    } else {
      container.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [selectedDayIndex, currentDay, timezone])

  return (
    <div className="flex flex-col min-h-64 overflow-hidden border-l border-black/10 dark:border-white/10">
      <input type="hidden" name="slotStart" value={selectedSlot?.start ?? ''} />
      <input type="hidden" name="slotEnd" value={selectedSlot?.end ?? ''} />

      <div className="shrink-0 flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => {
            setSelectedDayIndex(Math.max(0, selectedDayIndex - 1))
            setSelectedSlot(null)
          }}
          className="size-8"
        >
          <ChevronLeft className="size-4" />
        </Button>
        {currentDay ? (
          <div className="text-center">
            <span className="font-medium text-black dark:text-white">
              {currentDay.displayWeekday}, {currentDay.displayDate}
            </span>
          </div>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => {
            setSelectedDayIndex(Math.min(days.length - 1, selectedDayIndex + 1))
            setSelectedSlot(null)
          }}
          className="size-8"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="shrink-0 flex items-center justify-center border-b border-black/10 dark:border-white/10 px-4 h-8">
        <Select
          value={timezone}
          onValueChange={(value) => {
            setTimezone(value)
            setSelectedSlot(null)
            setSelectedDayIndex(0)
          }}
        >
          <SelectTrigger className="border-none bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent shadow-none focus:ring-0 focus-visible:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="p-2">
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz} value={tz}>{tz.replace(/_/g, ' ')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
      <div className="relative flex-1 min-h-0">
        <div ref={timelineRef} className="absolute inset-0 overflow-y-auto">
          {Array.from({ length: 25 }).map((_, i) => {
            const top = 1 + i * REM_PER_HOUR
            return (
              <div
                key={i}
                className="absolute inset-x-0 flex items-start"
                style={{ top: `${top}rem` }}
              >
                <span className="shrink-0 w-12 -translate-y-1/2 text-right pr-2 text-xs text-neutral-500 numeric">
                  {`${i.toString().padStart(2, '0')}:00`}
                </span>
                <div className="flex-1 border-t border-black/5 dark:border-white/5" />
              </div>
            )
          })}
          {currentDay?.slots.map((slot) => {
            const startHours = getHoursInTimezone(slot.start, timezone)
            const endHours = getHoursInTimezone(slot.end, timezone)
            const top = 1 + startHours * REM_PER_HOUR
            const height = (endHours - startHours) * REM_PER_HOUR
            const isSelected = selectedSlot?.start === slot.start

            return (
              <label
                key={slot.start}
                className={cn(
                  'absolute left-14 right-4 rounded-md border flex items-center px-3 cursor-pointer transition-colors numeric font-normal',
                  isSelected
                    ? 'bg-indigo-500 border-indigo-500 text-white'
                    : 'border-neutral-200 bg-neutral-100 hover:bg-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:hover:border-neutral-700'
                )}
                style={{ top: `${top}rem`, height: `${height}rem` }}
              >
                <input
                  type="radio"
                  name="slotRadio"
                  value={slot.start}
                  checked={isSelected}
                  onChange={() => setSelectedSlot(slot)}
                  className="sr-only"
                  required
                />
                <span className="text-sm font-medium">{formatTime(slot.start, timezone)} – {formatTime(slot.end, timezone)}</span>
              </label>
            )
          })}
        </div>
        <div className="absolute inset-x-0 top-0 h-4 bg-linear-to-b from-white dark:from-neutral-950" />
        <div className="absolute inset-x-0 bottom-0 h-4 bg-linear-to-t from-white dark:from-neutral-950" />
      </div>
      )}
    </div>
  )
}
