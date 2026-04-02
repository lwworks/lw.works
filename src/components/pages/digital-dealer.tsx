import { Brow } from "@/components/atoms/brow"
import { Heading } from "@/components/atoms/heading"
import { Section } from "@/components/sections"
import { DigitalDealerHeroSection, type DigitalDealerHeroSectionContent } from "@/components/sections/digital-dealer/hero"
import { TestimonialSection, TestimonialSectionContent } from "@/components/sections/testimonial"
import { Link } from "@/i18n/navigation"
import { Metadata } from "next"
import { ComponentProps } from "react"
import { CTA } from "../atoms/cta"
import { UrgencyNote } from "../atoms/urgency-note"
import { CalloutSection } from "../sections/callout"
import { DigitalDealerContactSection, DigitalDealerContactSectionContent } from "../sections/digital-dealer/contact"
import { DigitalDealerPricingSection, DigitalDealerPricingSectionContent } from "../sections/digital-dealer/pricing"
import { Button } from "../ui/button"

export type DigitalDealerPageContent = {
  metadata: Metadata
  hero: DigitalDealerHeroSectionContent
  testimonial: TestimonialSectionContent
  problem: {
    brow: string
    title: string
    paragraphs: string[]
  },
  solution: {
    id: string
    brow: string
    title: string
    paragraphs: string[]
    cta: {
      href: string
      label: string
      urgencyNote: string
    }
  }
  pricing: DigitalDealerPricingSectionContent
  contact: DigitalDealerContactSectionContent
}

export const DigitalDealerPage = ({ content }: { content: DigitalDealerPageContent }) => {
  return (
    <main className="pt-16">
      <DigitalDealerHeroSection content={content.hero} />
      <TestimonialSection content={content.testimonial} />
      <Section id={content.solution.id} bottomGradients="green-indigo">
        <Brow className="mb-4" color="rose">{content.problem.brow}</Brow>
        <Heading as="h2" className="mb-8">{content.problem.title}</Heading>
        {content.problem.paragraphs.map((paragraph) => (
          <p key={paragraph} className="mt-4">{paragraph}</p>
        ))}
        <Brow className="mb-4 pt-24" color="emerald">{content.solution.brow}</Brow>
        <Heading as="h2" className="mb-8">{content.solution.title}</Heading>
        {content.solution.paragraphs.map((paragraph) => (
          <p key={paragraph} className="mt-4">{paragraph}</p>
        ))}
        <CTA>
          <Button asChild>
            <Link href={content.solution.cta.href as ComponentProps<typeof Link>['href']}>
              <span>{content.solution.cta.label}</span>
            </Link>
          </Button>
          <UrgencyNote>{content.solution.cta.urgencyNote}</UrgencyNote>
        </CTA>
      </Section>
      <CalloutSection />
      <DigitalDealerPricingSection content={content.pricing} />
      <DigitalDealerContactSection content={content.contact} />
    </main>
  )
}