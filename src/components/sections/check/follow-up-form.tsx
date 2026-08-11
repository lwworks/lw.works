"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Send, Spinner } from "@mynaui/icons-react"
import { useRef, useState } from "react"

const companySizeOptions = [
  { id: "company-size-1-10", value: "1-10", label: "1 – 10" },
  { id: "company-size-11-20", value: "11-20", label: "11 – 20" },
  { id: "company-size-21-50", value: "21-50", label: "21 – 50" },
  { id: "company-size-50-plus", value: "50-plus", label: "50 +" },
]

const currentSystemOptions = [
  { id: "system-accounting", value: "accounting", label: "SevDesk/Lexware" },
  { id: "system-office", value: "office", label: "Word & Excel" },
  { id: "system-industry-software", value: "industry-software", label: "Branchensoftware" },
  { id: "system-online-shop", value: "online-shop", label: "Online-Shop" },
  { id: "system-warehouse-erp", value: "warehouse-erp", label: "Lager/ERP" },
  { id: "system-analog", value: "analog", label: "Viel läuft analog" },
]

const situationOptions = [
  { id: "situation-late-office", value: "late-office", label: "Ich hänge abends noch im Büro fest" },
  { id: "situation-missed-requests", value: "missed-requests", label: "Uns rutschen Anfragen oder Termine durch" },
  { id: "situation-duplicate-entry", value: "duplicate-entry", label: "Wir tippen dasselbe in verschiedene Systeme" },
  { id: "situation-key-person-knowledge", value: "key-person-knowledge", label: "Zu viel Wissen hängt an einzelnen Personen" },
  { id: "situation-growth-processes", value: "growth-processes", label: "Wir wachsen, die Abläufe kommen nicht hinterher" },
]

const timelineOptions = [
  { id: "timeline-asap", value: "asap", label: "So bald wie möglich" },
  { id: "timeline-1-3-months", value: "1-3-months", label: "In den nächsten 1–3 Monaten" },
  { id: "timeline-research", value: "research", label: "Ich will mich erstmal nur schlau machen" },
]

export const CheckFollowUpForm = ({ className }: { className?: string }) => {
  const formRef = useRef<HTMLFormElement>(null)
  const [pending, setPending] = useState(false)

  return (
    <form ref={formRef} className={cn("grid grid-cols-2 gap-x-16 gap-y-8", className)}>
      <FieldGroup className="flex flex-col gap-5">
        <Field>
          <FieldLabel htmlFor="booking-name">Dein Unternehmen</FieldLabel>
          <Input id="booking-name" name="name" placeholder="Mustermann GmbH" />
        </Field>
        <FieldSet>
          <FieldLegend variant="label">Unternehmensgröße</FieldLegend>
          <RadioGroup
            name="company-size"
            className="flex flex-row gap-6"
          >
            {companySizeOptions.map((option) => (
              <Field key={option.id} orientation="horizontal" className="w-fit">
                <RadioGroupItem value={option.value} id={option.id} />
                <FieldLabel htmlFor={option.id} className="font-normal">
                  {option.label}
                </FieldLabel>
              </Field>
            ))}
          </RadioGroup>
        </FieldSet>
        <Field className="grow">
          <FieldLabel htmlFor="follow-up-message">Nachricht</FieldLabel>
          <Textarea id="booking-message" name="message" placeholder="Soll ich sonst noch etwas wissen?" className="resize-none min-h-24 grow" />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">Welche Systeme habt ihr heute im Einsatz?</FieldLegend>
          <div data-slot="checkbox-group" className="grid grid-cols-2 gap-3">
            {currentSystemOptions.map((option) => (
              <Field key={option.id} orientation="horizontal" className="w-fit">
                <Checkbox id={option.id} name="current-systems" value={option.value} />
                <FieldLabel htmlFor={option.id} className="font-normal">
                  {option.label}
                </FieldLabel>
              </Field>
            ))}
          </div>
        </FieldSet>
        <FieldSet>
          <FieldLegend variant="label">Was beschreibt Deine Lage am besten?</FieldLegend>
          <RadioGroup name="situation" className="flex flex-col gap-3">
            {situationOptions.map((option) => (
              <Field key={option.id} orientation="horizontal" className="w-fit">
                <RadioGroupItem value={option.value} id={option.id} />
                <FieldLabel htmlFor={option.id} className="font-normal">
                  {option.label}
                </FieldLabel>
              </Field>
            ))}
          </RadioGroup>
        </FieldSet>
        <FieldSet>
          <FieldLegend variant="label">Wann willst Du das angehen?</FieldLegend>
          <RadioGroup name="timeline" className="flex flex-col gap-3">
            {timelineOptions.map((option) => (
              <Field key={option.id} orientation="horizontal" className="w-fit">
                <RadioGroupItem value={option.value} id={option.id} />
                <FieldLabel htmlFor={option.id} className="font-normal">
                  {option.label}
                </FieldLabel>
              </Field>
            ))}
          </RadioGroup>
        </FieldSet>
      </FieldGroup>
      <div className="col-span-2 flex">
        <Button type="submit">
          {pending ? (
            <Spinner data-icon="inline-start" className="animate-spin" />
          ) : (
            <Send data-icon="inline-start" strokeWidth={2} />
          )}
          <span>Fragebogen absenden</span>
        </Button>
      </div>
    </form>
  )
}