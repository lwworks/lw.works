'use client'

import { Heading } from '@/components/atoms/heading'
import { Section } from '@/components/sections'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { type BookingFormState, submitBookingForm } from '@/lib/actions/submit-booking-form'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Send } from '@mynaui/icons-react'
import { ReactNode, useActionState, useCallback, useEffect, useRef, useState } from 'react'

type AvailableSlot = {
  start: string
  end: string
  displayStart: string
  displayEnd: string
}

type DaySlots = {
  date: string
  displayDate: string
  displayWeekday: string
  slots: AvailableSlot[]
}

const REM_PER_HOUR = 3.5

export type CalendarBookingSectionContent = {
  title: string
  description: string
  fields: {
    name: {
      label: string
      placeholder: string
    },
    email: {
      label: string
      placeholder: string
    },
    message: {
      label: string
      placeholder: string
    }
  }
  privacy: ReactNode
  submit: string
  successMessage: string
  errorMessages: {
    default: string
    botDetected: string
    slotTaken: string
  }
  booking: {
    calendarId: string
    timezone: string
    teamMemberSlug: string
    slotDurationMinutes: number
    advanceDays: number
    availableDays: number[]
    availableHours: { start: number; end: number }
  }
}

export const CalendarBookingSection = ({ content }: { content: CalendarBookingSectionContent }) => {
  const [days, setDays] = useState<DaySlots[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null)

  const formRef = useRef<HTMLFormElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const initialState: BookingFormState = { success: false }
  const [state, formAction, pending] = useActionState(submitBookingForm, initialState)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      setSelectedSlot(null)
    }
  }, [state])

  const fetchSlots = useCallback(async () => {
    setLoading(true)
    const from = new Date()
    const to = new Date(from)
    to.setDate(to.getDate() + content.booking.advanceDays)

    const params = new URLSearchParams({
      member: content.booking.teamMemberSlug,
      from: from.toISOString().split('T')[0],
      to: to.toISOString().split('T')[0]
    })

    try {
      const res = await fetch(`/api/availability?${params}`)
      if (res.ok) {
        const data: DaySlots[] = await res.json()
        setDays(data)
        const firstWithSlots = data.findIndex((d) => d.slots.length > 0)
        if (firstWithSlots !== -1) {
          setSelectedDayIndex(firstWithSlots)
        }
      }
    } finally {
      setLoading(false)
    }
  }, [content.booking.teamMemberSlug, content.booking.advanceDays])

  useEffect(() => {
    fetchSlots()
  }, [fetchSlots])

  useEffect(() => {
    const container = timelineRef.current
    if (!container) return
    const startHour = content.booking.availableHours.start
    const scrollTarget = startHour * REM_PER_HOUR * 16 - 32 // convert rem to px (assuming 16px base)
    container.scrollTo({ top: Math.max(0, scrollTarget), behavior: 'smooth' })
  }, [selectedDayIndex, days, content.booking.availableHours.start])

  const currentDay = days[selectedDayIndex]

  return (
    <Section horizontalPadding="none" verticalPadding="none">
      <form ref={formRef} action={formAction}>
        <input type="hidden" name="memberSlug" value={content.booking.teamMemberSlug} />
        <input type="hidden" name="slotStart" value={selectedSlot?.start ?? ''} />
        <input type="hidden" name="slotEnd" value={selectedSlot?.end ?? ''} />
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[1fr]">
          <div className="flex flex-col gap-6 p-16">
            <div>
              <Heading as="h2">{content.title}</Heading>
              <p className="mt-4 text-muted-foreground">
                {content.description}
              </p>
            </div>
            <FieldGroup className="flex flex-col gap-5">
              <Field>
                <FieldLabel htmlFor="booking-name">{content.fields.name.label}</FieldLabel>
                <Input id="booking-name" name="name" placeholder={content.fields.name.placeholder} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="booking-email">{content.fields.email.label}</FieldLabel>
                <Input id="booking-email" name="email" type="email" placeholder={content.fields.email.placeholder} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="booking-message">{content.fields.message.label}</FieldLabel>
                <Textarea id="booking-message" name="message" placeholder={content.fields.message.placeholder} rows={3} />
              </Field>
            </FieldGroup>
            <label htmlFor="booking-privacy" className="flex items-start gap-2 cursor-pointer">
              <Checkbox id="booking-privacy" name="privacy" required className="mt-0.5" />
              <span className="text-sm text-muted-foreground">{content.privacy}</span>
            </label>
            <div>
              <Button type="submit">
                <Send strokeWidth={2} />
                <span>{content.submit}</span>
              </Button>
            </div>
            {state.error && (
              <p className="text-sm text-red-600 dark:text-red-400" aria-live="polite">{state.error}</p>
            )}
            {state.success && (
              <p className="text-sm text-green-600 dark:text-green-400" aria-live="polite">{content.successMessage}</p>
            )}
          </div>
          <div className="flex flex-col min-h-64 overflow-hidden border-l border-black/10 dark:border-white/10">
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
            <div className="text-sm h-8 flex gap-1 items-center justify-center border-b border-black/10 dark:border-white/10">
              <span>Zeitzone:</span>
              <span className="numeric">{content.booking.timezone}</span>
            </div>
            <div className="relative flex-1 min-h-0">
              <div ref={timelineRef} className="absolute inset-0 overflow-y-auto">
                {Array.from({ length: 25 }).map((_, i) => {
                  const top = i * REM_PER_HOUR
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
                  const startDate = new Date(slot.start)
                  const endDate = new Date(slot.end)
                  const startMinutes = startDate.getHours() * 60 + startDate.getMinutes()
                  const endMinutes = endDate.getHours() * 60 + endDate.getMinutes()
                  const top = (startMinutes / (24 * 60)) * 24 * REM_PER_HOUR
                  const height = ((endMinutes - startMinutes) / (24 * 60)) * 24 * REM_PER_HOUR
                  const isSelected = selectedSlot?.start === slot.start

                  return (
                    <label
                      key={slot.start}
                      className={cn(
                        'absolute left-14 right-4 rounded-md border flex items-center px-3 cursor-pointer transition-colors numeric font-normal',
                        isSelected
                          ? 'bg-indigo-500 border-indigo-500 text-white'
                          : 'border-neutral-200 bg-neutral-100 hover:bg-neutral-200 hover:border-neutral-300'
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
                      <span className="text-sm font-medium">{slot.displayStart} – {slot.displayEnd}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </form>
    </Section>
  )
}
