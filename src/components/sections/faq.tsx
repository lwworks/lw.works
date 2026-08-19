'use client'

import { Brow } from "@/components/atoms/brow"
import { Heading } from "@/components/atoms/heading"
import { Link } from "@/components/link"
import { Section, SectionBackground } from "@/components/sections"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

export type FaqItemContent = {
  question: string
  answer: string[]
  cta?: {
    label: string
    href: string
  }
}

export type FaqSectionContent = {
  id: string
  brow: string
  title: string
  description?: string
  items: FaqItemContent[]
}

export const FaqSection = ({ background, content }: { background?: SectionBackground, content: FaqSectionContent }) => {
  return (
    <Section id={content.id} verticalPadding="small" background={background}>
      <Brow className="mb-2" color="lavender">{content.brow}</Brow>
      <Heading as="h2">{content.title}</Heading>
      {content.description && (
        <p className="mt-4 max-w-xl">{content.description}</p>
      )}
      <Accordion type="multiple" className={cn("w-full mt-4")}>
        {content.items.map((item, index) => (
          <AccordionItem key={`faq-${index}`} value={`faq-${index}`} className="border-none p-0 m-0 mt-4">
            <AccordionTrigger className="text-base font-medium text-black dark:text-white hover:no-underline p-0 cursor-pointer">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-base mt-4">
              {item.answer.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {item.cta && (
                <div className="mt-4">
                  <Link href={item.cta.href} className="text-black dark:text-white underline hover:opacity-80">{item.cta.label}</Link>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  )
}
