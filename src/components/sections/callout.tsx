import { Link } from "@/components/link"
import { Section } from "@/components/sections"
import { DangerCircleSolid, DangerTriangleSolid, InfoCircleSolid } from "@mynaui/icons-react"
import { CTA } from "../atoms/cta"
import { Heading } from "../atoms/heading"
import { UrgencyNote } from "../atoms/urgency-note"
import { Button } from "../ui/button"

export type CalloutSectionContent = {
  title: string
  paragraphs: string[]
  cta?: {
    buttons: {
      variant?: 'secondary' | 'outline'
      label: string
      href: string
    }[]
    urgencyNote?: string
  }
}

type CallOutSectionProps = {
  variant?: 'info' | 'amber' | 'danger'
  content: CalloutSectionContent
}

export const CalloutSection = ({ variant = 'info', content }: CallOutSectionProps) => {
  return (
    <Section verticalPadding="small" background="stripes">
      <div className="flex items-start gap-2">
        {variant === 'info' && <InfoCircleSolid className="size-5 shrink-0 text-indigo-500 mt-1" />}
        {variant === 'amber' && <DangerCircleSolid className="size-5 shrink-0 text-amber-500 mt-1" />}
        {variant === 'danger' && <DangerTriangleSolid className="size-5 shrink-0 text-rose-500 mt-1" />}
        <Heading as="h2" size="h3">{content.title}</Heading>
      </div>
      {content.paragraphs.map((paragraph, index) => (
        <p key={index} className="mt-4">{paragraph}</p>
      ))}
      {content.cta && (
        <CTA>
          {content.cta.buttons.map((button) => (
            <Button key={button.label} variant={button.variant} asChild>
              <Link href={button.href}>
                <span>{button.label}</span>
              </Link>
            </Button>
          ))}
          {content.cta.urgencyNote && <UrgencyNote>{content.cta.urgencyNote}</UrgencyNote>}
        </CTA>
      )}
    </Section>
  )
}