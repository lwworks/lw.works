import { Brow } from "@/components/atoms/brow"
import { CTA } from "@/components/atoms/cta"
import { Heading } from "@/components/atoms/heading"
import { UrgencyNote } from "@/components/atoms/urgency-note"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Send } from "@mynaui/icons-react"
import { Section } from ".."

export type DigitalDealerContactSectionContent = {
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
}

export const DigitalDealerContactSection = ({ content }: { content: DigitalDealerContactSectionContent }) => {
  return (
    <Section bottomGradients="indigo-orange">
      <Brow className="mb-4" color="indigo">{content.brow}</Brow>
      <Heading as="h2">{content.title}</Heading>
      <p className="mt-8 max-w-xl">{content.description}</p>
      <form className="mt-12 flex flex-col gap-8">
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
            <label className="col-span-2 flex items-center gap-3 rounded-lg border border-black/10 bg-indigo-50/50 px-4 py-3 cursor-default">
              <Checkbox checked disabled className="opacity-60" />
              <div>
                <span className="text-sm font-medium text-black">{content.plans.base.label}</span>
                <span className="block text-xs text-muted-foreground">{content.plans.base.description}</span>
              </div>
            </label>
            <label htmlFor="plan-service" className="flex items-center gap-3 rounded-lg border border-black/10 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors has-checked:border-indigo-500 has-checked:bg-indigo-50/50">
              <Checkbox id="plan-service" name="plans" value="service" />
              <div>
                <span className="text-sm font-medium text-black">{content.plans.service.label}</span>
                <span className="block text-xs text-muted-foreground">{content.plans.service.description}</span>
              </div>
            </label>
            <label htmlFor="plan-convert" className="flex items-center gap-3 rounded-lg border border-black/10 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors has-checked:border-indigo-500 has-checked:bg-indigo-50/50">
              <Checkbox id="plan-convert" name="plans" value="convert" />
              <div>
                <span className="text-sm font-medium text-black">{content.plans.convert.label}</span>
                <span className="block text-xs text-muted-foreground">{content.plans.convert.description}</span>
              </div>
            </label>
            <label htmlFor="plan-scale" className="flex items-center gap-3 rounded-lg border border-black/10 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors has-checked:border-indigo-500 has-checked:bg-indigo-50/50">
              <Checkbox id="plan-scale" name="plans" value="scale" />
              <div>
                <span className="text-sm font-medium text-black">{content.plans.scale.label}</span>
                <span className="block text-xs text-muted-foreground">{content.plans.scale.description}</span>
              </div>
            </label>
            <label htmlFor="plan-growth" className="flex items-center gap-3 rounded-lg border border-black/10 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors has-checked:border-indigo-500 has-checked:bg-indigo-50/50">
              <Checkbox id="plan-growth" name="plans" value="growth" />
              <div>
                <span className="text-sm font-medium text-black">{content.plans.growth.label}</span>
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
          <Button type="submit">
            <span>{content.submit}</span>
            <Send data-icon="inline-end" strokeWidth={2} />
          </Button>
          <UrgencyNote>{content.urgencyNote}</UrgencyNote>
        </CTA>
      </form>
    </Section>
  )
}