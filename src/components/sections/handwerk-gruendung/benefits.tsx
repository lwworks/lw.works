import { Brow } from "@/components/atoms/brow"
import { Heading } from "@/components/atoms/heading"
import { Section } from "@/components/sections"

export const HandwerkGruendungBenefitsSection = () => {
  return (
    <Section verticalPadding="none" horizontalPadding="none">
      <div className="p-4 pb-8 pt-12 sm:px-8 lg:p-16 lg:pb-8 border-b border-black/10 dark:border-white/10">
        <Brow color="lavender" className="mb-2">Deine Vorteile</Brow>
        <Heading as="h2">Was Digitalisierung Dir als Gründer bringt</Heading>
        <p className="mt-4 text-balance">Nicht mehr Software um der Software willen — sondern Abläufe, die Dich auf der Baustelle halten und den Betrieb tragen, sobald der erste Auftrag, der erste Mitarbeitende oder der erste Engpass kommt.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-black/10 dark:border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-black/10 dark:divide-white/10">
        <div className="p-4 py-8 sm:px-8 lg:p-16 lg:py-8">
          <Heading as="h3">Keine Prozessschulden von Tag 1</Heading>
          <p className="mt-2">WhatsApp, Zettel und Excel werden schnell zur inoffiziellen Betriebssoftware. Wenn Du Abläufe jetzt sauber aufsetzt, musst Du sie nicht in drei Jahren teuer wieder auseinandernehmen.</p>
        </div>
        <div className="p-4 py-8 sm:px-8 lg:p-16 lg:py-8">
          <Heading as="h3">Abends wirklich Feierabend</Heading>
          <p className="mt-2">Angebote, Nachfassen, Termine, Rechnungen: Das frisst die Stunden nach der Baustelle. Automatisierte Handgriffe geben Dir den Abend zurück — ohne dass Qualität oder Zuverlässigkeit leiden.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-black/10 dark:border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-black/10 dark:divide-white/10">
        <div className="p-4 py-8 sm:px-8 lg:p-16 lg:py-8">
          <Heading as="h3">Keine Anfrage geht verloren</Heading>
          <p className="mt-2">Telefon, WhatsApp, Mail, Zettel auf der Windschutzscheibe: Ohne klaren Weg vom ersten Kontakt zum Angebot rutschen Aufträge durch. Wir legen fest, wo Anfragen landen und wer darauf reagiert.</p>
        </div>
        <div className="p-4 py-8 sm:px-8 lg:p-16 lg:py-8">
          <Heading as="h3">Angebote, die nach Betrieb aussehen</Heading>
          <p className="mt-2">Der erste Eindruck entscheidet, ob aus der Anfrage ein Auftrag wird. Professionelle Angebote und Rechnungen vom ersten Kunden an — ohne dass Du jedes Mal bei null anfängst.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-black/10 dark:border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-black/10 dark:divide-white/10">
        <div className="p-4 py-8 sm:px-8 lg:p-16 lg:py-8">
          <Heading as="h3">Wissen sitzt nicht nur in Deinem Kopf</Heading>
          <p className="mt-2">Sobald der erste Geselle oder die Bürokraft kommt, darf der Betrieb nicht stehen bleiben, wenn Du auf der Baustelle bist. Dokumentierte Abläufe machen Dich vertretbar.</p>
        </div>
        <div className="p-4 pt-8 pb-12 sm:px-8 lg:p-16 lg:pt-8">
          <Heading as="h3">Mit dem, was Du schon nutzt</Heading>
          <p className="mt-2">WhatsApp, Excel, DATEV, Handwerkersoftware: Wir lassen bestehende Tools miteinander sprechen. Neue Software nur, wenn sie Dir wirklich etwas abnimmt — nicht weil ein Toolstack gut aussieht.</p>
        </div>
      </div>
    </Section>
  )
}
