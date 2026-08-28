import { Heading } from "@/components/atoms/heading"
import { Main } from "@/components/main"
import { Section } from "@/components/sections"
import { MDXSection } from "@/components/sections/mdx"
import ImpressumContent, { toc } from "@/content/pages/impressum.mdx"

export const ImpressumPage = () => {
  return (
    <Main>
      <Section verticalPadding="small">
        <Heading as="h1">Impressum</Heading>
      </Section>
      <MDXSection content={ImpressumContent} toc={toc} />
    </Main>
  )
}