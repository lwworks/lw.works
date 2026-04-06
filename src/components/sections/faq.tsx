'use client'

import { Brow } from "@/components/atoms/brow"
import { Heading } from "@/components/atoms/heading"
import { Section } from "@/components/sections"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/link"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

export type FaqItemContent = {
  question: string
  answer: string[]
  cta?: {
    label: string
    href: ComponentProps<typeof Link>['href']
  }
}

export type FaqSectionContent = {
  id: string
  brow: string
  title: string
  description?: string
  items: FaqItemContent[]
}

export const FaqSection = ({ content }: { content: FaqSectionContent }) => {
  return (
    <Section id={content.id}>
      <Brow className="mb-4" color="emerald">{content.brow}</Brow>
      <Heading as="h2">{content.title}</Heading>
      {content.description && (
        <p className="mt-8 max-w-xl text-muted-foreground">{content.description}</p>
      )}
      <Accordion type="multiple" className={cn("w-full mt-4")}>
        {content.items.map((item, index) => (
          <AccordionItem key={`faq-${index}`} value={`faq-${index}`} className="border-none p-0 m-0 mt-4">
            <AccordionTrigger className="text-base font-medium text-black dark:text-white hover:no-underline p-0">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-base mt-4">
              {item.answer.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {item.cta && (
                <div className="mt-4">
                  <Button variant="link" asChild className="h-auto p-0 text-base">
                    <Link href={item.cta.href}>{item.cta.label}</Link>
                  </Button>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  )
}
