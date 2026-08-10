import { Brow } from "@/components/atoms/brow"
import { Heading } from "@/components/atoms/heading"
import { Section } from "@/components/sections"

export const CheckHeroSection = () => {
  return (
    <Section background="1">
      <Brow color="lime" className="mb-2">Jetzt buchen</Brow>
      <Heading as="h1">Dein Prozess-Check</Heading>
      <p className="mt-8 max-w-lg text-balance">Wir nehmen uns eine Stunde Zeit, um uns gemeinsam Deine Prozesse und Systeme anzuschauen. Anschließend erhältst Du ein Dokument mit den drei größten Zeitfressern inklusive Lösungsempfehlungen.</p>
      <p className="mt-4 max-w-lg text-balance"><span className="font-medium text-black dark:text-white">Buch' Dir als ersten Schritt ein kurzes Telefonat</span>, in dem wir ein paar Details abstimmen und ein paar Fragen klären, damit ich vorbereitet in Deinen Prozess-Check kommen kann.</p>
      <p className="mt-4 max-w-lg text-balance text-black dark:text-white font-medium">Eine Stunde. Kostenlos. Kein Verkaufsgespräch.</p>
    </Section >
  )
}