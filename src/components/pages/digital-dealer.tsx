import { Brow } from "@/components/atoms/brow"
import { Heading } from "@/components/atoms/heading"
import { Section } from "@/components/sections"
import { DigitalDealerHeroSection, type DigitalDealerHeroSectionContent } from "@/components/sections/digital-dealer/hero"
import { TestimonialSection, TestimonialSectionContent } from "@/components/sections/testimonial"
import { Metadata } from "next"
import { CalloutSection, CalloutSectionContent } from "../sections/callout"
import { DigitalDealerContactSection, DigitalDealerContactSectionContent } from "../sections/digital-dealer/contact"
import { DigitalDealerPricingSection, DigitalDealerPricingSectionContent } from "../sections/digital-dealer/pricing"
import { FaqSection, FaqSectionContent } from "../sections/faq"
import { TeamMemberSection, TeamMemberSectionContent } from "../sections/contact/team-member"

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
  }
  callout: CalloutSectionContent
  pricing: DigitalDealerPricingSectionContent
  contact: DigitalDealerContactSectionContent
  faq: FaqSectionContent
  contactPerson: TeamMemberSectionContent
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
      </Section>
      <CalloutSection variant="danger" content={content.callout} />
      <DigitalDealerPricingSection content={content.pricing} />
      <DigitalDealerContactSection content={content.contact} />
      <FaqSection content={content.faq} />
      <TeamMemberSection content={content.contactPerson} />
    </main>
  )
}