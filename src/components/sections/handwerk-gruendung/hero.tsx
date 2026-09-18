import { Brow } from "@/components/atoms/brow"
import { CTA } from "@/components/atoms/cta"
import { Heading } from "@/components/atoms/heading"
import { NextAvailability } from "@/components/atoms/next-availability"
import { Link } from "@/components/link"
import { Section } from "@/components/sections"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "@mynaui/icons-react"

export const HandwerkGruendungHeroSection = () => {
  return (
    <Section background="paint-1">
      <div className="relative z-10">
        <Brow color="lavender" className="mb-4">Für frisch gegründete Handwerksbetriebe</Brow>
        <Heading as="h1">Digitalisierung für junge Handwerksbetriebe</Heading>
        <p className="mt-8 max-w-lg text-balance"><span className="font-medium text-black dark:text-white">Gründung heißt: noch keine gewachsenen Umwege.</span> Anfragen, Angebote, Termine und Rechnungen lassen sich jetzt so legen, dass sie mitwachsen — statt in drei Jahren mühsam umgebaut zu werden.</p>
        <p className="mt-4 max-w-lg text-balance"><span className="font-medium text-black dark:text-white">Deine Zeit gehört auf die Baustelle.</span> Im kostenlosen Prozess-Check schauen wir, welche Abläufe Dich am meisten aufhalten und wie Du sie von Tag 1 entlastest. <span className="font-medium text-black dark:text-white">Kostenlos und ohne Verkaufsgespräch.</span></p>
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
    </Section>
  )
}
