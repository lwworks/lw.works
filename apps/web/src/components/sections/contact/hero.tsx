import { Brow } from "@lw/ui/atoms/brow"
import { CTA } from "@lw/ui/atoms/cta"
import { Heading } from "@lw/ui/atoms/heading"
import { Button } from "@lw/ui/components/button"
import { NextAvailability } from "@/components/atoms/next-availability"
import { Link } from "@/components/link"
import { Section } from "@/components/sections"
import { ArrowDown } from "@mynaui/icons-react"

export const ContactHeroSection = () => {
  return (
    <Section background="paint-5">
      <Brow className="mb-2">Kontakt</Brow>
      <Heading as="h1">Lass uns sprechen</Heading>
      <p className="mt-8 max-w-lg text-balance">Du hast eine Frage, ein Projekt im Kopf oder willst einfach wissen, ob wir Dir helfen können? Schreib uns, ruf an oder buch Dir direkt einen Termin – wir melden uns schnell und unkompliziert.</p>
      <CTA>
        <Button asChild>
          <Link href="#buchung">
            <span>Termin buchen</span>
            <ArrowDown strokeWidth={2} className="size-4 opacity-50" />
          </Link>
        </Button>
        <NextAvailability bookingType="lukas" className="ml-2 my-2" />
      </CTA>
    </Section>
  )
}
