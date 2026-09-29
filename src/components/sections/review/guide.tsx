import { Heading } from "@/components/atoms/heading"
import { Section } from ".."

export const ReviewGuideSection = () => {
  return (
    <Section verticalPadding="small">
      <Heading as="h2">So schreibst Du eine hilfreiche Bewertung</Heading>
      <p className="my-8">Eine gute Bewertung soll nicht primär uns helfen, sondern anderen Menschen und Unternehmen, die vor denselben Herausforderungen stehen, wie Du vor unserer Zusammenarbeit. Wenn Du auf diese Punkte achtest, wird Deine Bewertung ganz sicher hilfreich für andere sein.</p>
      <Heading as="h3">Worum ging es?</Heading>
      <p className="mt-4 mb-8">Wenn Du in Deine Bewertung schreibst, welche Probleme wir für Euch gelöst haben, hilft es anderen dabei, einzuschätzen, ob das auch zu ihrer Situation passt.</p>
      <Heading as="h3">Details sind wichtig</Heading>
      <p className="mt-4 mb-8">Was hat gut funktioniert, was hätte vielleicht noch besser laufen können? Häufig sind Details wie Erreichbarkeit, Kommunikation, Zuverlässigkeit und ähnliche Themen nützlich, um unsere Arbeitsweise zu verstehen.</p>
      <Heading as="h3">Sei ehrlich</Heading>
      <p className="mt-4">In jedem Fall ist eine Bewertung nur dann hilfreich, wenn sie Deine ehrliche Meinung und Erfahrung aus unserer Zusammenarbeit wiedergibt. Auch kritische Hinweise helfen uns, unsere Arbeit zu verbessern.</p>
    </Section>
  )
}