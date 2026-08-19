import { Brow } from "@/components/atoms/brow"
import { CTA } from "@/components/atoms/cta"
import { Heading } from "@/components/atoms/heading"
import { NextAvailability } from "@/components/atoms/next-availability"
import { Link } from "@/components/link"
import { Section } from "@/components/sections"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "@mynaui/icons-react"

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

export const HomeHeroSection = () => {
  return (
    <Section background="paint-2">
      <div className="relative z-10">
        <Brow color="lavender" className="mb-4">Digitalisierung für den Mittelstand</Brow>
        <Heading as="h1">Deine Marge schlummert in Deinen Prozessen</Heading>
        <p className="mt-8 max-w-lg text-balance"><span className="font-medium text-black dark:text-white">Wir legen sie frei.</span> Mit Schnittstellen, Prozessautomatisierung, KI-Integrationen und individueller Software.</p>
        <p className="mt-4 max-w-lg text-balance"><span className="font-medium text-black dark:text-white">Klingt kompliziert? Ist es gar nicht.</span> Im kostenlosen Prozess-Check finden wir schnell und einfach Optimierungsmöglichkeiten, um Dir Zeit und Geld zurückzuholen. <span className="font-medium text-black dark:text-white">Kostenlos und ohne Verkaufsgespräch.</span></p>
        <CTA>
          <Button asChild>
            <Link href="/check">
              <span>Kostenloser Prozess-Check</span>
              <ArrowRight strokeWidth={2} className="size-4 opacity-50" />
            </Link>
          </Button>
          <NextAvailability bookingType="check" className="ml-2 my-2" />
        </CTA>
      </div>
    </Section >
  )
}