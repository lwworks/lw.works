import { Heading } from '@/components/atoms/heading'
import { Section } from '@/components/sections'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ReactNode } from 'react'
import { Clock1, Globe, Send } from '@mynaui/icons-react'
import { BookingForm } from './booking-form'
import { CalendarTimeline } from './calendar-timeline'

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
  noSlotsMessage: string
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
  return (
    <Section horizontalPadding="none" verticalPadding="none">
      <BookingForm successMessage={content.successMessage}>
        <input type="hidden" name="memberSlug" value={content.booking.teamMemberSlug} />
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[1fr]">
          <div className="flex flex-col gap-6 p-16">
            <div>
              <Heading as="h2">{content.title}</Heading>
              <p className="mt-4">
                {content.description}
              </p>
              <ul className="mt-4 flex items-center gap-4">
                <li className="flex items-center gap-1 text-neutral-500 text-sm">
                  <Clock1 strokeWidth={1.5} className="size-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{content.booking.slotDurationMinutes} Min.</span>
                </li>
                <li className="flex items-center gap-1 text-neutral-500 text-sm">
                  <Globe strokeWidth={1.5} className="size-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{content.booking.timezone}</span>
                </li>
              </ul>
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
                <Textarea id="booking-message" name="message" placeholder={content.fields.message.placeholder} rows={3} className="resize-none" />
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
          </div>
          <CalendarTimeline
            teamMemberSlug={content.booking.teamMemberSlug}
            advanceDays={content.booking.advanceDays}
            noSlotsMessage={content.noSlotsMessage}
          />
        </div>
      </BookingForm>
    </Section>
  )
}
