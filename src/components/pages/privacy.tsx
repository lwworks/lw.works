import { Heading } from "@/components/atoms/heading"
import { Section } from "@/components/sections"
import { MDXSection } from "@/components/sections/mdx"
import DatenschutzContent, { toc } from "@/content/pages/datenschutz.mdx"

export const PrivacyPage = () => {
  return (
    <main className="pt-16">
      <Section verticalPadding="small">
        <Heading as="h1">Datenschutz</Heading>
      </Section>
      <MDXSection content={DatenschutzContent} toc={toc} />
    </main>
  )
}