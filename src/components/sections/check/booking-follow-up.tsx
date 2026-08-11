import { Heading } from "@/components/atoms/heading"
import { CheckCircleSolid } from "@mynaui/icons-react"
import { Section } from ".."
import { CheckFollowUpForm } from "./follow-up-form"

export const CheckBookingFollowUp = () => {
  return (
    <Section verticalPadding="small">
      <div className="flex items-center gap-3">
        <div className="size-10 relative">
          <div className="absolute inset-1.5 bg-black rounded-full" />
          <CheckCircleSolid className="relative size-10 text-lime" />
        </div>
        <Heading as="h2">Dein Termin ist bestätigt</Heading>
      </div>
      <p className="mt-4 max-w-lg text-balance">
        Wenn Du magst, beantworte bitte noch kurz ein paar Fragen, um mir die Vorbereitung auf unser Gespräch zu erleichtern.
      </p>
      <CheckFollowUpForm className="mt-16" />
    </Section>
  )
}