"use client"

import { Button } from "@/components/ui/button"
import { useSlots } from "@/lib/google-calendar/use-slots"
import { ChevronLeft, ChevronRight, DangerCircleSolid, Spinner } from "@mynaui/icons-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { useState } from "react"

export const BookingCalendar = ({ bookingType }: { bookingType: string }) => {
  const { slots, loading, error } = useSlots(bookingType)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)

  if (loading) return (
    <div className="flex flex-col items-center justify-center">
      <Spinner className="size-6 animate-spin" />
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center gap-1 text-sm text-red-600 dark:text-red-400">
      <DangerCircleSolid className="size-4 opacity-50 inline" />
      <p>Fehler beim Laden des Kalenders.</p>
    </div>
  )

  if (!slots || Object.keys(slots).length === 0) return (
    <div className="flex items-center justify-center gap-1">
      <p className="text-sm text-muted-foreground">Leider sind momentan keine Termine verfügbar.</p>
    </div>
  )

  const days = Object.keys(slots ?? {})

  return (
    <div className="flex flex-col">
      <div className="flex-none flex items-center justify-between h-16 px-4 border-b border-black/10 dark:border-white/10">
        <Button type="button" variant="outline" size="icon" onClick={() => setSelectedDayIndex(Math.max(0, selectedDayIndex - 1))} disabled={selectedDayIndex === 0}>
          <ChevronLeft strokeWidth={1.5} className="size-4" />
        </Button>
        <p className="font-medium text-black dark:text-white">{format(new Date(days[selectedDayIndex]), 'EEEE, dd. MMMM', { locale: de })}</p>
        <Button type="button" variant="outline" size="icon" onClick={() => setSelectedDayIndex(Math.min(days.length - 1, selectedDayIndex + 1))} disabled={selectedDayIndex === days.length - 1}>
          <ChevronRight strokeWidth={1.5} className="size-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">

      </div>
    </div>
  )
}