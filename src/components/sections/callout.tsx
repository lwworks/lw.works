import { Section } from "@/components/sections"
import { DangerCircleSolid } from "@mynaui/icons-react"
import { Heading } from "../atoms/heading"


export const CalloutSection = () => {
  return (
    <Section verticalPadding="small">
      <div className="absolute inset-0 bg-pattern-stripes" />
      <div className="relative">
        <div className="flex items-start gap-2">
          <DangerCircleSolid className="size-6 text-amber-500 mt-0.5" />
          <Heading as="h2" size="h3">Nur 5 Plätze verfügbar</Heading>
        </div>
        <p className="mt-4">Sichere Dir einen der limitierten Plätze. Fülle das Formular aus, und wir melden uns innerhalb von 24 Stunden bei Dir.</p>
      </div>
    </Section>
  )
}