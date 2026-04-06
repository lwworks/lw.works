'use client'

import { Brow } from "@/components/atoms/brow"
import { CTA } from "@/components/atoms/cta"
import { Heading } from "@/components/atoms/heading"
import { Section } from "@/components/sections"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { type ContactInquiryFormState, submitContactInquiryForm } from "@/lib/actions/submit-contact-inquiry-form"
import { Send } from "@mynaui/icons-react"
import { useActionState, useEffect, useRef } from "react"

export type ContactFormSectionContent = {
  id: string
  brow: string
  title: string
  description: string
  fields: {
    name: {
      label: string
      placeholder: string
    }
    email: {
      label: string
      placeholder: string
    }
    message: {
      label: string
      placeholder: string
    }
  }
  privacy: React.ReactNode
  submit: string
  successMessage: string
}

const initialState: ContactInquiryFormState = { success: false }

export const ContactFormSection = ({ content }: { content: ContactFormSectionContent }) => {
  const [state, formAction, pending] = useActionState(submitContactInquiryForm, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <Section id={content.id} bottomGradients="indigo-orange">
      <Brow className="mb-4" color="indigo">{content.brow}</Brow>
      <Heading as="h1">{content.title}</Heading>
      <p className="mt-8 max-w-xl">{content.description}</p>
      <form ref={formRef} action={formAction} className="mt-12 flex flex-col gap-8">
        <FieldGroup className="grid gap-5">
          <Field>
            <FieldLabel htmlFor="contact-name">{content.fields.name.label}</FieldLabel>
            <Input id="contact-name" name="name" placeholder={content.fields.name.placeholder} required autoComplete="name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="contact-email">{content.fields.email.label}</FieldLabel>
            <Input id="contact-email" name="email" type="email" placeholder={content.fields.email.placeholder} required autoComplete="email" />
          </Field>
          <Field>
            <FieldLabel htmlFor="contact-message">{content.fields.message.label}</FieldLabel>
            <Textarea id="contact-message" name="message" placeholder={content.fields.message.placeholder} required rows={6} />
          </Field>
        </FieldGroup>
        <label htmlFor="contact-privacy" className="flex items-start gap-2 cursor-pointer">
          <Checkbox id="contact-privacy" name="privacy" required className="mt-0.5" />
          <span className="text-sm text-muted-foreground">
            {content.privacy}
          </span>
        </label>
        <CTA className="mt-0">
          <Button type="submit" disabled={pending}>
            <Send strokeWidth={2} />
            <span>{content.submit}</span>
          </Button>
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
