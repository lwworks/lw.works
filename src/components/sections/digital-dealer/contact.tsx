'use client'

import { Brow } from "@/components/atoms/brow"
import { CTA } from "@/components/atoms/cta"
import { Heading } from "@/components/atoms/heading"
import { UrgencyNote } from "@/components/atoms/urgency-note"
import { Section } from "@/components/sections"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { type ContactFormState, submitDigitalDealerForm } from "@/lib/actions/submit-digital-dealer-form"
import { Send } from "@mynaui/icons-react"
import { useActionState, useEffect, useRef } from "react"

export type DigitalDealerContactSectionContent = {
  id: string
  brow: string
  title: string
  description: string
  fields: {
    name: {
      label: string
      placeholder: string
    },
    dealership: {
      label: string
      placeholder: string
    },
    email: {
      label: string
      placeholder: string
    },
    phone: {
      label: string
      placeholder: string
    },
  }
  plans: {
    label: string
    base: {
      label: string
      description: string
    },
    service: {
      label: string
      description: string
    },
    convert: {
      label: string
      description: string
    },
    scale: {
      label: string
      description: string
    },
    growth: {
      label: string
      description: string
    },
  }
  privacy: React.ReactNode
  submit: string
  urgencyNote: string
  successMessage: string
}

const initialState: ContactFormState = { success: false }

export const DigitalDealerContactSection = ({ content }: { content: DigitalDealerContactSectionContent }) => {
  const [state, formAction, pending] = useActionState(submitDigitalDealerForm, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <Section id={content.id} bottomGradients="indigo-orange">
      <Brow className="mb-4" color="indigo">{content.brow}</Brow>
      <Heading as="h2">{content.title}</Heading>
      <p className="mt-8 max-w-xl">{content.description}</p>
      <form ref={formRef} action={formAction} className="mt-12 flex flex-col gap-8">
        <FieldGroup className="grid grid-cols-2 gap-x-8 gap-y-5">
          <Field>
            <FieldLabel htmlFor="name">{content.fields.name.label}</FieldLabel>
            <Input id="name" name="name" placeholder={content.fields.name.placeholder} required />
          </Field>
          <Field>
            <FieldLabel htmlFor="dealership">{content.fields.dealership.label}</FieldLabel>
            <Input id="dealership" name="dealership" placeholder={content.fields.dealership.placeholder} required />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">{content.fields.email.label}</FieldLabel>
            <Input id="email" name="email" type="email" placeholder={content.fields.email.placeholder} required />
          </Field>
          <Field>
            <FieldLabel htmlFor="phone">{content.fields.phone.label}</FieldLabel>
            <Input id="phone" name="phone" type="tel" placeholder={content.fields.phone.placeholder} />
          </Field>
        </FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">{content.plans.label}</FieldLegend>
          <div className="grid grid-cols-2 gap-4">
            <label className="col-span-2 flex items-center gap-3 rounded-lg border border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/50 px-4 py-3 cursor-default">
              <Checkbox checked />
              <div>
                <span className="text-sm font-medium text-black dark:text-white">{content.plans.base.label}</span>
                <span className="block text-xs text-muted-foreground">{content.plans.base.description}</span>
              </div>
            </label>
            <label htmlFor="plan-service" className="flex items-center gap-3 rounded-lg border border-black/10 dark:border-white/10 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors has-checked:border-indigo-500 dark:has-checked:border-indigo-500 has-checked:bg-indigo-50/50 dark:has-checked:bg-indigo-950/50">
              <Checkbox id="plan-service" name="plans" value="service" />
              <div>
                <span className="text-sm font-medium text-black dark:text-white">{content.plans.service.label}</span>
                <span className="block text-xs text-muted-foreground">{content.plans.service.description}</span>
              </div>
            </label>
            <label htmlFor="plan-convert" className="flex items-center gap-3 rounded-lg border border-black/10 dark:border-white/10 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors has-checked:border-indigo-500 dark:has-checked:border-indigo-500 has-checked:bg-indigo-50/50 dark:has-checked:bg-indigo-950/50">
              <Checkbox id="plan-convert" name="plans" value="convert" />
              <div>
                <span className="text-sm font-medium text-black dark:text-white">{content.plans.convert.label}</span>
                <span className="block text-xs text-muted-foreground">{content.plans.convert.description}</span>
              </div>
            </label>
            <label htmlFor="plan-scale" className="flex items-center gap-3 rounded-lg border border-black/10 dark:border-white/10 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors has-checked:border-indigo-500 dark:has-checked:border-indigo-500 has-checked:bg-indigo-50/50 dark:has-checked:bg-indigo-950/50">
              <Checkbox id="plan-scale" name="plans" value="scale" />
              <div>
                <span className="text-sm font-medium text-black dark:text-white">{content.plans.scale.label}</span>
                <span className="block text-xs text-muted-foreground">{content.plans.scale.description}</span>
              </div>
            </label>
            <label htmlFor="plan-growth" className="flex items-center gap-3 rounded-lg border border-black/10 dark:border-white/10 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors has-checked:border-indigo-500 dark:has-checked:border-indigo-500 has-checked:bg-indigo-50/50 dark:has-checked:bg-indigo-950/50">
              <Checkbox id="plan-growth" name="plans" value="growth" />
              <div>
                <span className="text-sm font-medium text-black dark:text-white">{content.plans.growth.label}</span>
                <span className="block text-xs text-muted-foreground">{content.plans.growth.description}</span>
              </div>
            </label>
          </div>
        </FieldSet>
        <label htmlFor="privacy" className="flex items-start gap-2 cursor-pointer">
          <Checkbox id="privacy" name="privacy" required className="mt-0.5" />
          <span className="text-sm text-muted-foreground">
            {content.privacy}
          </span>
        </label>
        <CTA>
          <Button type="submit" disabled={pending}>
            <Send strokeWidth={2} />
            <span>{content.submit}</span>
          </Button>
          <UrgencyNote>{content.urgencyNote}</UrgencyNote>
        </CTA>
        {state.error && (
          <p className="text-sm text-red-600 dark:text-red-400" aria-live="polite">{state.error}</p>
        )}
        {state.success && (
          <p className="text-sm text-green-600 dark:text-green-400" aria-live="polite">{content.successMessage}</p>
        )}
      </form>
    </Section>
  )
}