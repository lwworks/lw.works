import { Heading } from "../atoms/heading"
import { Section } from "../sections"

export const ImpressumPage = () => {
  return (
    <main className="pt-16">
      <Section verticalPadding="small">
        <Heading as="h1">Impressum</Heading>
      </Section>
      <Section verticalPadding="small">
        CONTENT
      </Section>
    </main>
  )
}