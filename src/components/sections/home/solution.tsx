import { Brow } from "@/components/atoms/brow"
import { CTA } from "@/components/atoms/cta"
import { Heading } from "@/components/atoms/heading"
import { NextAvailability } from "@/components/atoms/next-availability"
import { Link } from "@/components/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "@mynaui/icons-react"
import Image from "next/image"
import { Section } from ".."

export const SolutionSection = () => {
  return (
    <Section background="paint-4" verticalPadding="none" horizontalPadding="none">
      <div className="p-16 pb-8 border-b border-black/10 dark:border-white/10">
        <Brow color="lime" className="mb-2">Unser Angebot</Brow>
        <Heading as="h2">Wie wir das gemeinsam lösen</Heading>
        <p className="mt-4 text-balance">Unser Angebotskonzept ist so aufgebaut, dass wir Dir möglichst schnell Ergebnisse liefern und Dein Unternehmen nachhaltig digitalisieren können.</p>
        <div className="flex items-center gap-4 mt-8">
          <div className="relative rounded-full overflow-hidden size-24 border-2">
            <Image src="/images/lukas-brunkhorst.jpg" alt="Lukas Brunkhorst" fill className="object-cover object-center" />
          </div>
          <div>
            <Brow color="lime">Dein Ansprechpartner</Brow>
            <Heading as="h3" size="h2" className="-ml-0.5">Lukas Brunkhorst</Heading>
            <p className="">Entwickler & Geschäftsführer</p>
          </div>
        </div>
        <p className="mt-8">Ich bin seit 2017 als Entwickler selbstständig und habe Anfang 2024 die LW Works GmbH gegründet. Inzwischen durften wir bereits an Digitalisierungs- und KI-Projekten u.a. mit Airbus, BMW und Amazon arbeiten.</p>
      </div>
      <div className="p-16 py-8 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xl">01</span>
          <Heading as="h3">Dein Prozess-Check</Heading>
        </div>
        <p className="mt-2">Wir nehmen uns eine Stunde Zeit, um uns gemeinsam Deine Prozesse und Systeme anzuschauen. Anschließend erhältst Du ein Dokument mit den drei größten Zeitfressern inklusive Lösungsempfehlungen. <span className="font-medium text-black dark:text-white">100% kostenlos.</span></p>
        <CTA className="mt-6">
          <Button asChild>
            <Link href="/check">
              <span>Prozess-Check buchen</span>
              <ArrowRight strokeWidth={2} className="size-4 opacity-50" />
            </Link>
          </Button>
          <NextAvailability memberSlug="lukas" className="ml-2" />
        </CTA>
      </div>
      <div className="border-b border-black/10 dark:border-white/10 grid grid-cols-2 divide-x divide-black/10 dark:divide-white/10">
        <div className="p-16 py-8">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl">02</span>
            <Heading as="h3">Kickstart</Heading>
          </div>
          <p className="mt-2">In einem Workshop steigen wir tiefer in Deine Abläufe und Systeme ein und holen die Mitarbeitenden dazu, die täglich damit arbeiten. Anschließend setzen wir einen Hebel direkt um, damit Du direkt sichtbare Ergebnisse erzielst.</p>
        </div>
        <div className="p-16 py-8">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl">03</span>
            <Heading as="h3">Projekt</Heading>
          </div>
          <p className="mt-2">Nach einem Workshop mit Deinem Team setzen wir über einen Zeitraum von 6 Wochen umfangreiche Lösungen um, die Dir und Deinem Team die tägliche Arbeit erleichtern und so Deine Marge freisetzen.</p>
        </div>
      </div>
      <div className="p-16 pt-8">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xl">04</span>
          <Heading as="h3">Begleitung</Heading>
        </div>
        <p className="mt-2">Wenn Du möchtest, bleiben wir als strategischer Digitalisierungspartner über 6+ Monate an Eurer Seite und setzen stetig weitere Lösungen um, die Dein Unternehmen nachhaltig digital und skalierbar aufstellen.</p>
      </div>
    </Section>
  )
}