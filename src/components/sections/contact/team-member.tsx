import { Brow } from '@/components/atoms/brow'
import { Heading } from '@/components/atoms/heading'
import { Section } from '@/components/sections'
import Image from 'next/image'

export type TeamMemberSectionContent = {
  id: string
  brow?: string
  name: string
  role: string
  image: { src: string; alt: string }
  paragraphs: string[]
  cta?: {
    label: string
    href: string
  }
}

export const TeamMemberSection = ({ content }: { content: TeamMemberSectionContent }) => {
  return (
    <Section id={content.id}>
      <div className="flex flex-col sm:flex-row items-start gap-8 sm:gap-12">
        <div className="relative shrink-0 size-24 overflow-hidden rounded-full border-2 border-indigo-500">
          <Image
            src={content.image.src}
            alt={content.image.alt}
            fill
            sizes="96px"
            className="object-cover object-center"
          />
        </div>
        <div>
          {content.brow && (<Brow className="mb-4" color="indigo">{content.brow}</Brow>)}
          <Heading as="h2">{content.name}</Heading>
          <p className="mt-1 text-muted-foreground">{content.role}</p>
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-4">{paragraph}</p>
          ))}
        </div>
      </div>
    </Section>
  )
}
