import { Brow } from "@/components/atoms/brow"
import { Heading } from "@/components/atoms/heading"
import { Section } from "@/components/sections"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export type DigitalDealerContactPersonSectionContent = {
  id: string
  brow: string
  name: string
  role: string
  paragraphs: string[]
  image: {
    src: string
    alt: string
  }
  cta: {
    label: string
    href: string
  }
}

export const DigitalDealerContactPersonSection = ({ content }: { content: DigitalDealerContactPersonSectionContent }) => {
  return (
    <Section id={content.id} verticalPadding="none" horizontalPadding="none">
      <div className="grid grid-cols-3">
        <div className="col-span-2 p-16">
          <Brow className="mb-4" color="indigo">{content.brow}</Brow>
          <Heading as="h2">{content.name}</Heading>
          <p className="mt-1 text-muted-foreground">{content.role}</p>
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-4">{paragraph}</p>
          ))}
          <div className="mt-8">
            <Button asChild>
              <a href={content.cta.href} target="_blank" rel="noopener noreferrer">{content.cta.label}</a>
            </Button>
          </div>
        </div>
        <div className="relative overflow-hidden border-l border-black/10 dark:border-white/10">
          <Image
            src={content.image.src}
            alt={content.image.alt}
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-indigo-500/10" />
        </div>
      </div>
    </Section>
  )
}
