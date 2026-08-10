'use client'

import { Field, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'

export type MeetingTypeFieldsContent = {
  label: string
  online: { label: string; value: 'online' }
  phone: { label: string; value: 'phone' }
  phoneField: {
    label: string
    placeholder: string
  }
}

export const MeetingTypeFields = ({ content }: { content: MeetingTypeFieldsContent }) => {
  const [meetingType, setMeetingType] = useState<'online' | 'phone'>(content.phone.value)

  return (
    <>
      <FieldSet>
        <FieldLegend variant="label">{content.label}</FieldLegend>
        <RadioGroup
          name="meetingType"
          value={meetingType}
          onValueChange={(value) => setMeetingType(value as 'online' | 'phone')}
          className="flex flex-row gap-6"
        >
          <Field orientation="horizontal" className="w-fit">
            <RadioGroupItem value={content.online.value} id="meeting-type-online" />
            <FieldLabel htmlFor="meeting-type-online" className="font-normal">
              {content.online.label}
            </FieldLabel>
          </Field>
          <Field orientation="horizontal" className="w-fit">
            <RadioGroupItem value={content.phone.value} id="meeting-type-phone" />
            <FieldLabel htmlFor="meeting-type-phone" className="font-normal">
              {content.phone.label}
            </FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
      {meetingType === 'phone' && (
        <Field>
          <FieldLabel htmlFor="booking-phone">{content.phoneField.label}</FieldLabel>
          <Input
            id="booking-phone"
            name="phone"
            type="tel"
            placeholder={content.phoneField.placeholder}
            required
            autoComplete="tel"
          />
        </Field>
      )}
    </>
  )
}
