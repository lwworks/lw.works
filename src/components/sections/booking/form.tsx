"use client"

import { PrivacyCheckbox } from "@/components/atoms/privacy-checkbox";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { BookingFormState, submitBookingForm } from "@/lib/actions/submit-booking-form";
import { DangerCircle, Send, Spinner } from "@mynaui/icons-react";
import { ReactNode, useActionState, useState } from "react";
import { BookingCalendar } from "./calendar";

interface BookingFormProps {
  bookingConfig: BookingConfig;
  showMessageInput?: boolean;
  children: ReactNode;
}

export const BookingForm = ({ bookingConfig, showMessageInput = false, children }: BookingFormProps) => {
  const [selectedType, setSelectedType] = useState<string>(bookingConfig.type[0]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const initialState: BookingFormState = { success: false }
  const [state, formAction, pending] = useActionState(submitBookingForm, initialState)

  const handleDayChange = (index: number) => {
    setSelectedDayIndex(index)
    setSelectedSlot(null)
  }

  const calendarProps = {
    bookingConfig,
    selectedDayIndex,
    onDayChange: handleDayChange,
    selectedSlot,
    onSlotChange: setSelectedSlot,
  }

  return (
    <form className="md:grid md:grid-cols-2 md:divide-x md:divide-black/10 dark:md:divide-white/10" action={formAction}>
      <input type="hidden" name="bookingConfig" value={bookingConfig.id} />
      <input type="hidden" name="slot" value={selectedSlot ?? ""} />
      <div className="p-4 py-8 sm:px-8 lg:p-16">
        {children}
        <FieldGroup className="mt-8 flex flex-col gap-5">
          <Field>
            <FieldLabel htmlFor="name">Dein Name</FieldLabel>
            <Input type="text" id="name" name="name" placeholder="Max Mustermann" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Deine Email-Adresse</FieldLabel>
            <Input type="email" id="email" name="email" placeholder="max@unternehmen.de" required />
          </Field>
          {bookingConfig.type.length > 1 ? (
            <FieldSet>
              <FieldLegend variant="label">Bevorzugtes Format</FieldLegend>
              <RadioGroup
                name="type"
                className="flex flex-row gap-6"
                value={selectedType}
                onValueChange={(value) => setSelectedType(value)}
                required
              >
                {bookingConfig.type.map((type) => (
                  <Field key={type} orientation="horizontal" className="w-fit">
                    <RadioGroupItem value={type} id={`type-${type}`} />
                    <FieldLabel htmlFor={`type-${type}`} className="font-normal">
                      {type === 'online' ? 'Online-Meeting' : 'Telefonat'}
                    </FieldLabel>
                  </Field>
                ))}
              </RadioGroup>
            </FieldSet>) : null}
          {selectedType === 'phone' && (
            <Field>
              <FieldLabel htmlFor="phone">Deine Telefonnummer</FieldLabel>
              <Input id="phone" name="phone" type="tel" placeholder="+49 171 234 567" required />
            </Field>
          )}
          {showMessageInput && (
            <Field>
              <FieldLabel htmlFor="message">Deine Nachricht</FieldLabel>
              <Textarea id="message" name="message" placeholder="Worüber wollen wir sprechen?" rows={3} className="resize-none" />
            </Field>
          )}
          <BookingCalendar {...calendarProps} className="md:hidden -mx-4 sm:-mx-8 border-y border-black/10 dark:border-white/10 min-h-96" />
          <PrivacyCheckbox />
          <Button type="submit" disabled={pending || !selectedSlot}>
            {pending ? (
              <Spinner strokeWidth={1.5} className="size-4 opacity-50 animate-spin" />
            ) : (
              <Send strokeWidth={1.5} className="size-4 opacity-50" />
            )}
            <span>Termin buchen</span>
          </Button>
        </FieldGroup>
        {state.error && (
          <div className="mt-4 flex gap-1 text-sm text-red-600 dark:text-red-400">
            <DangerCircle strokeWidth={1.5} className="size-4 shrink-0 mt-0.5" />
            <p>{state.error}</p>
          </div>
        )}
      </div>
      <BookingCalendar {...calendarProps} className="hidden md:flex" />
    </form>
  )
}