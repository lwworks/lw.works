import { Heading } from "@/components/atoms/heading"
import { Section } from "@/components/sections"
import { Check } from "@mynaui/icons-react"

export const BniReferralsSection = () => {
  return (
    <Section verticalPadding="small">
      <Heading as="h2">Mögliche Empfehlungen</Heading>
      <p className="my-4 md:my-8">
        <span className="font-medium text-black dark:text-white">Ich bin gespannt zu hören, wie ich Dich empfehlen kann! </span>
        <span>Und ich freue mich, wenn Du diese Aufhänger nutzt, um zu überlegen, ob Du mich in Deinem Netzwerk empfehlen kannst.</span>
      </p>
      <ul className="space-y-2">
        <li className="flex gap-2">
          <Check strokeWidth={2} className="size-4 shrink-0 mt-1 text-black/50 dark:text-lime" />
          <div>
            <span className="font-medium text-black dark:text-white">Geschäftsführer, die abends noch im Büro festhängen: </span>
            <span>Insbesondere im Bereich von Verwaltungsaufgaben lassen sich Prozesse häufig vereinfachen und automatisieren — dann macht der Computer die Überstunden.</span>
          </div>
        </li>
        <li className="flex gap-2">
          <Check strokeWidth={2} className="size-4 shrink-0 mt-1 text-black/50 dark:text-lime" />
          <div>
            <span className="font-medium text-black dark:text-white">Ein Betrieb steht, weil jemand im Urlaub ist: </span>
            <span>Das ist ein besonders gutes Anzeichen für schlummerndes Optimierungspotenzial.</span>
          </div>
        </li>
        <li className="flex gap-2">
          <Check strokeWidth={2} className="size-4 shrink-0 mt-1 text-black/50 dark:text-lime" />
          <div>
            <span className="font-medium text-black dark:text-white">Jemand spricht über KI: </span>
            <span>Für die meisten ist die KI einfach nur ein Chatbot — aber das Potenzial liegt in Prozessintegrationen. Und ehrlicherweise weiß man nicht, wo man anfangen soll.</span>
          </div>
        </li>
        <li className="flex gap-2">
          <Check strokeWidth={2} className="size-4 shrink-0 mt-1 text-black/50 dark:text-lime" />
          <div>
            <span className="font-medium text-black dark:text-white">Margen schrumpfen: </span>
            <span>Die Wirtschaft — und insbesondere der Mittelstand — kriselt. Ein Grund mehr, sich mit Optimierungen zu befassen und mehr Marge herauszukitzeln.</span>
          </div>
        </li>
      </ul>
    </Section>
  )
}