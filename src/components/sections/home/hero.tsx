import { Brow } from "@/components/atoms/brow"
import { Heading } from "@/components/atoms/heading"
import { Section } from "@/components/sections"

export type HomeHeroSectionContent = {
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

export const HomeHeroSection = ({ content }: { content?: HomeHeroSectionContent }) => {
  return (
    <Section bottomGradients="teal-indigo">
      <div>
        <Brow color="indigo" className="mb-4">Connecting the dots</Brow>
        <Heading as="h1">Design.<br />Engineering.<br />Automation.</Heading>
      </div>
      {/* <Brow className="mb-8" color="indigo">
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
      </CTA> */}
    </Section >
  )
}