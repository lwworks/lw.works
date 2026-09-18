import { Brow } from "@/components/atoms/brow"
import { Heading } from "@/components/atoms/heading"
import { Section } from "@/components/sections"

export const HandwerkGruendungScenariosSection = () => {
  return (
    <Section verticalPadding="none" horizontalPadding="none">
      <div className="p-4 pb-8 pt-12 sm:px-8 lg:p-16 lg:pb-8 border-b border-black/10 dark:border-white/10">
        <Brow color="lime" className="mb-2">Konkret im Betrieb</Brow>
        <Heading as="h2">So sieht das im Alltag aus</Heading>
        <p className="mt-4 text-balance">Kein Folientheater. Typische Stellen, an denen frisch gegründete Betriebe Zeit und Aufträge verlieren — und die sich früh lösen lassen.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-black/10 dark:border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-black/10 dark:divide-white/10">
        <div className="p-4 py-8 sm:px-8 lg:p-16 lg:py-8">
          <Heading as="h3">Anfragen und Angebote</Heading>
          <p className="mt-2">Aus WhatsApp, Mail und Rückruf wird ein nachvollziehbares Angebot — inkl. Nachfassen, statt dass der Zettel in der Kabine liegen bleibt.</p>
        </div>
        <div className="p-4 py-8 sm:px-8 lg:p-16 lg:py-8">
          <Heading as="h3">Termine und Baustellen</Heading>
          <p className="mt-2">Wer ist wann wo, welches Material muss mit, welcher Kunde wartet auf Rückmeldung: Planung, die nicht nur in Deinem Kalender im Kopf existiert.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-black/10 dark:divide-white/10">
        <div className="p-4 py-8 sm:px-8 lg:p-16 lg:py-8">
          <Heading as="h3">Rechnung und DATEV</Heading>
          <p className="mt-2">Leistungen dokumentieren, Rechnung raus, Daten an die Steuerkanzlei: weniger Abtippen zwischen Baustelle, Büro und Buchhaltung.</p>
        </div>
        <div className="p-4 pt-8 pb-12 sm:px-8 lg:p-16 lg:pt-8">
          <Heading as="h3">Übergabe an Mitarbeitende</Heading>
          <p className="mt-2">Der erste Geselle oder die Unterstützung im Büro kann den Stand sehen, ohne Dich anzurufen. Der Betrieb läuft, auch wenn Du auf der Leiter stehst.</p>
        </div>
      </div>
    </Section>
  )
}
