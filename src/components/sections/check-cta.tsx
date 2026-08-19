import { Brow } from "@/components/atoms/brow"
import { Heading } from "@/components/atoms/heading"
import { Section } from "@/components/sections"
import { ArrowRight } from "@mynaui/icons-react"
import { CTA } from "../atoms/cta"
import { NextAvailability } from "../atoms/next-availability"
import { Link } from "../link"
import { Button } from "../ui/button"

export const CheckCtaSection = () => {
  return (
    <Section id="check" background="stripes" verticalPadding="none">
      <div className="pt-8 pb-12 lg:pt-16 lg:pb-24">
        <Brow color="lime" className="mb-2">Jetzt buchen</Brow>
        <Heading as="h2">Dein Prozess-Check</Heading>
        <p className="mt-4 text-balance">Lass uns gemeinsam schauen, an welchen Stellen Du Zeit und Geld sparen kannst.</p>
        <p className="mt-4 text-black dark:text-white font-medium">Eine Stunde. Kostenlos. Kein Verkaufsgespräch.</p>
        <CTA>
          <Button asChild>
            <Link href="/check">
              <span>Erstgespräch buchen</span>
              <ArrowRight strokeWidth={2} className="size-4 opacity-50" />
            </Link>
          </Button>
          <NextAvailability bookingType="check" className="ml-2" />
        </CTA>
        {/* <TeamMember member="lukas" /> */}
      </div>
    </Section>
  )
}