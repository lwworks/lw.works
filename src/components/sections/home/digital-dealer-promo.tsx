import { Brow } from "@/components/atoms/brow"
import { CTA } from "@/components/atoms/cta"
import { Heading } from "@/components/atoms/heading"
import { UrgencyNote } from "@/components/atoms/urgency-note"
import { Section } from "@/components/sections"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/link"
import Image from "next/image"

export type DigitalDealerPromoSectionContent = {
  brow: string
  title: string
  description: string
  cta: {
    label: string
    href: string
    urgencyNote: string
  }
  imageAlt: string
}

export const DigitalDealerPromoSection = ({ content }: { content: DigitalDealerPromoSectionContent }) => {
  return (
    <Section bottomGradients="indigo-orange" verticalPadding="small">
      <Image src="/images/digital-dealer/renault-r5-website.png" alt={content.imageAlt} width={1604} height={1025} loading="eager" className="absolute bottom-0 -right-8 max-w-96 h-auto opacity-75 dark:hidden pointer-events-none" />
      <Image src="/images/digital-dealer/renault-r5-website-dark.png" alt={content.imageAlt} width={1604} height={1025} loading="eager" className="absolute bottom-0 -right-8 max-w-96 h-auto opacity-75 hidden dark:block pointer-events-none" />
      <Brow className="mb-4" color="indigo">{content.brow}</Brow>
      <Heading as="h2" className="max-w-xl text-balance">{content.title}</Heading>
      <p className="mt-6 max-w-lg text-balance">{content.description}</p>
      <CTA>
        <Button asChild>
          <Link href={content.cta.href}>
            <span>{content.cta.label}</span>
          </Link>
        </Button>
        <UrgencyNote>{content.cta.urgencyNote}</UrgencyNote>
      </CTA>
    </Section>
  )
}
