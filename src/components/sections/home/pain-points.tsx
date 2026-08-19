import { Brow } from "@/components/atoms/brow"
import { Heading } from "@/components/atoms/heading"
import { Section } from ".."

export const PainPointsSection = () => {
  return (
    <Section verticalPadding="none" horizontalPadding="none">
      <div className="p-4 pb-8 pt-12 sm:px-8 lg:p-16 lg:pb-8 border-b border-black/10 dark:border-white/10">
        <Brow color="lavender" className="mb-2">Status Quo</Brow>
        <Heading as="h2">Häufige Probleme unserer Kunden</Heading>
        <p className="mt-4 text-balance">Regelmäßig auftretende Symptome, die dafür sprechen, dass Deine Marge in Deinen internen Abläufen und Systemen versickert.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-black/10 dark:border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-black/10 dark:divide-white/10">
        <div className="p-4 py-8 sm:px-8 lg:p-16 lg:py-8">
          <Heading as="h3">Hängst Du abends noch im Büro?</Heading>
          <p className="mt-2">Du bist tagsüber eingespannt und musst Überstunden schieben, um Verwaltungsaufgaben zu erledigen.</p>
        </div>
        <div className="p-4 py-8 sm:px-8 lg:p-16 lg:py-8">
          <Heading as="h3">Rutschen Euch Anfragen durch?</Heading>
          <p className="mt-2">Häufig fehlen klare Abläufe und Verantwortlichkeiten — jede verzögerte Anfrage kostet Umsatz und Reputation.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-black/10 dark:border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-black/10 dark:divide-white/10">
        <div className="p-4 py-8 sm:px-8 lg:p-16 lg:py-8">
          <Heading as="h3">Abtippen ohne Ende?</Heading>
          <p className="mt-2">Verschiedene Systeme arbeiten mit denselben Daten, sprechen aber nicht miteinander. Das Team ist die Schnittstelle.</p>
        </div>
        <div className="p-4 py-8 sm:px-8 lg:p-16 lg:py-8">
          <Heading as="h3">Alles hängt an einer Person?</Heading>
          <p className="mt-2">Wenn bestimmte Personen ausfallen oder im Urlaub sind, verzögern sich ganze Prozesse oder Lieferungen.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-black/10 dark:border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-black/10 dark:divide-white/10">
        <div className="p-4 py-8 sm:px-8 lg:p-16 lg:pt-8">
          <Heading as="h3">Marge wächst nicht mit?</Heading>
          <p className="mt-2">Dein Unternehmen wächst, aber die Marge stagniert oder geht sogar zurück, weil der Verwaltungsaufwand in die Höhe schießt.</p>
        </div>
        <div className="p-4 pt-8 pb-12 sm:px-8 lg:p-16 lg:pt-8">
          <Heading as="h3">KI seit Monaten im Hinterkopf?</Heading>
          <p className="mt-2">Du weißt, dass Du Dich mal mit KI beschäftigen solltest, aber hast keine Zeit oder weißt nicht, wie Du anfangen sollst.</p>
        </div>
      </div>
    </Section>
  )
}