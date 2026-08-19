import { Heading } from "@/components/atoms/heading"
import { Section } from "@/components/sections"
import { CheckCircleSolid, Clock3, MapPin, Telephone } from "@mynaui/icons-react"

export const CheckProcessSection = () => {
  return (
    <Section id="process" verticalPadding="none" horizontalPadding="none">
      <div className="p-4 pb-8 pt-12 sm:px-8 lg:p-16 lg:pb-8 border-b border-black/10 dark:border-white/10">
        <div className="flex gap-3">
          <div className="size-9 shrink-0 relative">
            <div className="absolute inset-1 rounded-full bg-black" />
            <CheckCircleSolid className="relative size-9 text-lime" />
          </div>
          <Heading as="h2">In 3 Schritten zu digitaler Klarheit</Heading>
        </div>
        <p className="mt-4 text-balance">So finden wir im Prozess-Check heraus, welche Hebel Du nutzen kannst, um nachhaltig Zeit und Geld zu sparen.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/10 dark:divide-white/10">
        <div className="p-4 py-8 sm:px-8 lg:p-8 lg:pl-16 lg:pb-16">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl">01</span>
            <Heading as="h3">Erstgespräch</Heading>
          </div>
          <p className="mt-4">Wir lernen uns kurz kennen und klären ein paar Fragen, damit ich mich optimal auf Deinen Prozess-Check vorbereiten kann.</p>
          <ul className="mt-4 leading-none space-y-2">
            <li className="flex items-center gap-2">
              <Clock3 className="size-4 shrink-0 text-black dark:text-white" />
              <span>15 Minuten</span>
            </li>
            <li className="flex items-center gap-2">
              <Telephone className="size-4 shrink-0 text-black dark:text-white" />
              <span>Am Telefon oder online</span>
            </li>
          </ul>
        </div>
        <div className="p-4 py-8 sm:px-8 lg:p-8 lg:pb-16">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl">02</span>
            <Heading as="h3">Prozess-Check</Heading>
          </div>
          <p className="mt-4">Wir schauen uns gemeinsam Deine Prozesse und Systeme an, um Hebel zu identifizieren, mit denen Du Zeit und Geld sparen kannst.</p>
          <ul className="mt-4 leading-none space-y-2">
            <li className="flex items-center gap-2">
              <Clock3 className="size-4 shrink-0 text-black dark:text-white" />
              <span>45 – 60 Minuten</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-black dark:text-white" />
              <span>Online oder vor Ort</span>
            </li>
          </ul>
        </div>
        <div className="p-4 py-8 sm:px-8 lg:p-8 lg:pr-16 lg:pb-16">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl">03</span>
            <Heading as="h3">Auswertung</Heading>
          </div>
          <p className="mt-4">Du erhältst die drei größten Hebel inkl. Empfehlungen schwarz auf weiß. In einem kurzen Termin können wir Fragen klären und über Umsetzungsmöglichkeiten sprechen.</p>
        </div>
      </div>
    </Section>
  )
}