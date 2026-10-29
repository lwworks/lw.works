'use client'

import { Calendar } from '@lw/ui/components/calendar'
import type { DateRange } from 'react-day-picker'
import { de } from 'react-day-picker/locale'

const FIRST_DAY = new Date(2026, 0, 1)

export const SyncRangeCalendar = ({ range, onRangeChange }: { range: DateRange | undefined; onRangeChange: (range: DateRange | undefined) => void }) => {
  return (
    <Calendar
      mode="range"
      locale={de}
      selected={range}
      onSelect={onRangeChange}
      defaultMonth={range?.from}
      disabled={{ before: FIRST_DAY, after: new Date() }}
    />
  )
}
