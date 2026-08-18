import { MDX } from "@/components/sections/mdx"
import ImpressumContent from "@/content/impressum.mdx"
import { Heading } from "../atoms/heading"
import { Section } from "../sections"

export const ImpressumPage = () => {
  return (
    <main className="pt-16">
      <Section verticalPadding="small">
        <Heading as="h1">Impressum</Heading>
      </Section>
      <Section verticalPadding="none">
        <div className="pt-16 pb-24">
          <MDX>
            <ImpressumContent />
          </MDX>
        </div>
      </Section>
    </main>
  )
}