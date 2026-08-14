import { Brow } from "@/components/atoms/brow"
import { Heading } from "@/components/atoms/heading"
import { Link } from "@/components/link"
import Image from "next/image"
import { Section } from ".."

export const ServicesSection = () => {
  return (
    <Section verticalPadding="none" horizontalPadding="none">
      <div className="p-16 pb-8 border-b border-black/10 dark:border-white/10">
        <Brow color="lime" className="mb-2">Unser Service</Brow>
        <Heading as="h2">So kann das konkret aussehen</Heading>
        <p className="mt-4 text-balance">Jeder Betrieb ist anders – unsere interdisziplinäre Arbeitsweise ermöglicht uns, immer die beste Lösung für Dein Unternehmen zu finden. Wie das bei Dir aussehen kann, zeigt der <Link href="/check" className="underline text-black dark:text-white hover:opacity-80">Prozess-Check</Link>.</p>
      </div>
      <div className="grid grid-cols-2 divide-x divide-black/10 dark:divide-white/10 border-b border-black/10 dark:border-white/10">
        <div className="p-16 py-8 overflow-hidden">
          <Image src="/images/visuals/schnittstellen.png" alt="Software-Schnittstellen" width={800} height={437} className="mb-2 -mt-20 dark:hidden" />
          <Image src="/images/visuals/schnittstellen-dark.png" alt="Software-Schnittstellen" width={800} height={437} className="mb-2 -mt-20 hidden dark:block" />
          <Heading as="h3">Schnittstellen nutzen</Heading>
          <p className="mt-2">Emails, Kalender, Buchhaltung: Wir lassen Systeme, die Ihr schon nutzt, miteinander sprechen. So fließen Daten automatisch dorthin, wo sie gebraucht werden.</p>
        </div>
        <div className="p-16 py-8 overflow-hidden">
          <Image src="/images/visuals/automatisierung.png" alt="Automatisierung" width={800} height={437} className="mb-2 -mt-20 dark:hidden" />
          <Image src="/images/visuals/automatisierung-dark.png" alt="Automatisierung" width={800} height={437} className="mb-2 -mt-20 hidden dark:block" />
          <Heading as="h3">Automatisierung</Heading>
          <p className="mt-2">Wiederkehrende Handgriffe laufen automatisch – zuverlässig, jeden Tag, ohne dass jemand dran denken muss.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 divide-x divide-black/10 dark:divide-white/10">
        <div className="p-16 py-8 overflow-hidden">
          <Image src="/images/visuals/software.png" alt="Individuelle Software" width={800} height={437} className="mb-2 -mt-20 dark:hidden" />
          <Image src="/images/visuals/software-dark.png" alt="Individuelle Software" width={800} height={437} className="mb-2 -mt-20 hidden dark:block" />
          <Heading as="h3">Individuelle Software</Heading>
          <p className="mt-2">Wo Standard-Tools an ihre Grenzen kommen, entwickeln wir individuelle Systeme. Angepasst an Dein Unternehmen — nicht andersrum.</p>
        </div>
        <div className="p-16 py-8 overflow-hidden">
          <Image src="/images/visuals/ki-integration.png" alt="KI-Integration" width={800} height={437} className="mb-2 -mt-20 dark:hidden" />
          <Image src="/images/visuals/ki-integration-dark.png" alt="KI-Integration" width={800} height={437} className="mb-2 -mt-20 hidden dark:block" />
          <Heading as="h3">KI-Integration</Heading>
          <p className="mt-2">Wir arbeiten selbst bereits seit Jahren mit KI-Tools und wissen, an welchen Stellen sie wirklich Mehrwert liefern kann.</p>
        </div>
      </div>
    </Section>
  )
}