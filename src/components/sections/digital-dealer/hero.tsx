import { Brow } from "@/components/atoms/brow"
import { CTA } from "@/components/atoms/cta"
import { Heading } from "@/components/atoms/heading"
import { UrgencyNote } from "@/components/atoms/urgency-note"
import { Section } from "@/components/sections"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { ArrowDown } from "@mynaui/icons-react"
import Image from "next/image"
import { ComponentProps } from "react"

export type DigitalDealerHeroSectionContent = {
  imageAlt: string
  brow: string
  title: string
  description: string
  cta: {
    href: string
    label: string
    urgencyNote: string
  }
}

export const DigitalDealerHeroSection = ({ content }: { content: DigitalDealerHeroSectionContent }) => {
  return (
    <Section bottomGradients="rose-orange">
      <Image src="/images/digital-dealer/renault-r5-website.png" alt={content.imageAlt} width={1604} height={1025} loading="eager" className="absolute bottom-0 -right-21 max-w-96 h-auto opacity-75 dark:hidden pointer-events-none" />
      <Image src="/images/digital-dealer/renault-r5-website-dark.png" alt={content.imageAlt} width={1604} height={1025} loading="eager" className="absolute bottom-0 -right-21 max-w-96 h-auto opacity-75 hidden dark:block pointer-events-none" />
      <Brow className="mb-8" color="indigo">
        {content.brow}
      </Brow>
      <Heading as="h1">{content.title}</Heading>
      <p className="mt-8 max-w-lg text-balance">{content.description}</p>
      <CTA>
        <Button asChild>
          <Link href={content.cta.href as ComponentProps<typeof Link>['href']}>
            <span>{content.cta.label}</span>
            <ArrowDown className="size-4" strokeWidth={2} />
          </Link>
        </Button>
        <UrgencyNote>{content.cta.urgencyNote}</UrgencyNote>
      </CTA>
    </Section>
  )
}