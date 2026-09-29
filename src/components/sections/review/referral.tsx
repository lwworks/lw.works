import { Brow } from "@/components/atoms/brow"
import { Heading } from "@/components/atoms/heading"
import { Section } from ".."

export const ReviewReferralSection = () => {
  return (
    <Section id="check" background="stripes" verticalPadding="none">
      <div className="pt-8 pb-12 lg:pt-16 lg:pb-24">
        <Brow color="lime" className="mb-2">Empfehlungen</Brow>
        <Heading as="h2">Kennst Du jemanden, dem wir helfen können?</Heading>
        <p className="mt-4">Vielleicht weißt Du von jemandem in Deinem Netzwerk, der ähnliche digitale Herausforderungen hat, wie Du vor unserer Zusammenarbeit. Oder jemand liegt Dir ständig mit Digitalisierungsproblemen im Ohr. <span className="font-medium text-black dark:text-white">Wir freuen uns über jede Empfehlung!</span></p>
      </div>
    </Section>
  )
}