"use client"

import { PrivacyCheckbox } from "@/components/atoms/privacy-checkbox";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "@mynaui/icons-react";
import { ReactNode, useState } from "react";
import { BookingCalendar } from "./calendar";

interface BookingFormProps {
  bookingConfig: BookingConfig;
  showMessageInput?: boolean;
  children: ReactNode;
}

export const BookingForm = ({ bookingConfig, showMessageInput = false, children }: BookingFormProps) => {
  const [selectedType, setSelectedType] = useState<string>(bookingConfig.type[0]);

  return (
    <form className="grid grid-cols-2 divide-x divide-black/10 dark:divide-white/10">
      <div className="p-16">
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
          <PrivacyCheckbox />
          <Button type="submit">
            <Send strokeWidth={1.5} className="size-4 opacity-50" />
            <span>Termin buchen</span>
          </Button>
        </FieldGroup>
      </div>
      <BookingCalendar bookingConfig={bookingConfig} />
    </form>
  )
}