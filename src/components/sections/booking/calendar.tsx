"use client"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useSlots } from "@/lib/google-calendar/use-slots"
import { cn } from "@/lib/utils"
import { tz } from "@date-fns/tz"
import { ChevronLeft, ChevronRight, DangerCircle, Spinner } from "@mynaui/icons-react"
import { differenceInMinutes, format } from "date-fns"
import { de } from "date-fns/locale"
import { useEffect, useState } from "react"

export const BookingCalendar = ({ bookingConfig, className }: { bookingConfig: BookingConfig, className?: string }) => {
  const timezone = tz(bookingConfig.timezone)
  const { slots, loading, error } = useSlots(bookingConfig.id)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  useEffect(() => {
    setSelectedSlot(null)
  }, [selectedDayIndex])

  if (loading) return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Spinner className="size-6 animate-spin" />
    </div>
  )

  if (error) return (
    <div className={cn("flex items-center justify-center gap-1 text-sm text-red-600 dark:text-red-400", className)}>
      <DangerCircle strokeWidth={1.5} className="size-4 shrink-0" />
      <p>Fehler beim Laden des Kalenders.</p>
    </div>
  )

  if (!slots || Object.keys(slots).length === 0) return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      <p className="text-sm text-muted-foreground">Leider sind momentan keine Termine verfügbar.</p>
    </div>
  )

  const days = Object.keys(slots ?? {})
  const startOfDay = timezone(new Date(days[selectedDayIndex]).setHours(10, 0, 0, 0))

  return (
    <div className={cn("flex flex-col pb-px", className)}>
      <div className="flex-none flex items-center justify-between h-16 px-4 border-b border-black/10 dark:border-white/10">
        <Button type="button" variant="outline" size="icon" onClick={() => setSelectedDayIndex(Math.max(0, selectedDayIndex - 1))} disabled={selectedDayIndex === 0}>
          <ChevronLeft strokeWidth={1.5} className="size-4" />
        </Button>
        <p className="font-medium text-black dark:text-white">{format(new Date(days[selectedDayIndex]), 'EEEE, dd. MMMM', { locale: de })}</p>
        <Button type="button" variant="outline" size="icon" onClick={() => setSelectedDayIndex(Math.min(days.length - 1, selectedDayIndex + 1))} disabled={selectedDayIndex === days.length - 1}>
          <ChevronRight strokeWidth={1.5} className="size-4" />
        </Button>
      </div>
      <RadioGroup
        name="slot"
        value={selectedSlot}
        onValueChange={(value) => setSelectedSlot(value)}
        className="relative flex-1 overflow-y-auto block gap-0"
        required
      >
        {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map((time, i) => {
          const top = 14 + i * 90
          return (
            <div key={i} className="absolute inset-x-0 flex items-start" style={{ top }}>
              <span className="shrink-0 w-12 -translate-y-1/2 text-right pr-2 text-xs text-neutral-500 numeric">{time}</span>
              <span className="flex-1 border-t border-black/5 dark:border-white/5" />
            </div>
          )
        })}
        {slots[days[selectedDayIndex]].map((slot: BookingSlot) => {
          const start = timezone(new Date(slot.start))
          const id = format(start, 'yyyy-MM-dd HH:mm')
          const end = timezone(new Date(slot.end))
          const value = start.toISOString()

          return (
            <FieldLabel key={id} htmlFor={id} className={cn(
              "text-sm font-normal absolute left-14 right-4 border w-auto! p-0 pl-4 pt-px m-0 rounded-md! flex-row! justify-start",
              "bg-neutral-50 dark:bg-neutral-900 border-black/10 dark:border-white/10",
              "cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800",
              "has-data-checked:bg-lime has-data-checked:hover:bg-lime dark:has-data-checked:bg-lime dark:has-data-checked:hover:bg-lime has-data-checked:border-lime-dark dark:has-data-checked:border-lime-dark has-data-checked:text-black"
            )}
              style={{
                top: differenceInMinutes(start, startOfDay) * 1.5 + 15,
                height: differenceInMinutes(end, start) * 1.5 - 2,
              }}>
              <Field orientation="horizontal" className="flex w-auto! p-0! m-0 tabular-nums">
                {format(start, 'HH:mm')} – {format(end, 'HH:mm')}
                <RadioGroupItem value={value} id={id} className="sr-only" />
              </Field>
            </FieldLabel>
          )
        })}
      </RadioGroup>
    </div>
  )
}