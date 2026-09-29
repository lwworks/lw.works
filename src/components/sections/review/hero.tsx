import { Heading } from "@/components/atoms/heading"
import { TeamMember } from "@/components/molecules/team-member"
import { Section } from "@/components/sections"
import { Star } from "@mynaui/icons-react"

export const ReviewHeroSection = () => {
  return (
    <Section background="paint-1">
      <div className="relative z-10">
        <div className="flex items-center mb-3">
          <Star strokeWidth={1.5} className="size-6 shrink-0 fill-current text-lime stroke-black/5" />
          <Star strokeWidth={1.5} className="size-6 shrink-0 fill-current text-lime stroke-black/5" />
          <Star strokeWidth={1.5} className="size-6 shrink-0 fill-current text-lime stroke-black/5" />
          <Star strokeWidth={1.5} className="size-6 shrink-0 fill-current text-lime stroke-black/5" />
          <Star strokeWidth={1.5} className="size-6 shrink-0 fill-current text-lime stroke-black/5" />
        </div>
        <Heading as="h1">Bewerte unsere Arbeit</Heading>
        <p className="mt-8 max-w-xl"><span className="font-medium text-black dark:text-white">Bewertungen sind für unser Business essenziell.</span> Mit Deiner Bewertung hilfst Du uns, unsere Dienstleistung zu verbessern und möglichst viele weitere Unternehmen in ihre digitale Zukunft zu begleiten.</p>
        <p className="mt-4 max-w-xl">Wir freuen uns insbesondere über Bewertungen auf Google, Trustpilot und ProvenExpert — am besten bewertest Du uns gleich auf allen drei Portalen, wenn Du schon dabei bist.</p>
        <p className="mt-4 text-black dark:text-white font-medium">Danke, dass Du Dir Zeit dafür nimmst!</p>
        <TeamMember member="lukas" className="mt-8" />
      </div>
    </Section >
  )
}