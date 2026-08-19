import { MDXSection } from "@/components/sections/mdx"
import ImpressumContent, { toc } from "@/content/pages/impressum.mdx"
import { Heading } from "../atoms/heading"
import { Section } from "../sections"

export const ImpressumPage = () => {
  return (
    <main className="pt-16">
      <Section verticalPadding="small">
        <Heading as="h1">Impressum</Heading>
      </Section>
      <MDXSection content={ImpressumContent} toc={toc} />
    </main>
  )
}