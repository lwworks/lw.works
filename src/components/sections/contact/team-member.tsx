import { Link } from '@/components/link'
import { CTA } from '@/components/atoms/cta'
import { Brow } from '@/components/atoms/brow'
import { Heading } from '@/components/atoms/heading'
import { NextAvailability } from '@/components/atoms/next-availability'
import { Section } from '@/components/sections'
import { Button } from '@/components/ui/button'
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
    nextAvailability?: {
      memberSlug: string
    }
  }
}

export const TeamMemberSection = ({ content }: { content: TeamMemberSectionContent }) => {
  return (
    <Section id={content.id}>
      {content.brow && (<Brow className="mb-4" color="indigo">{content.brow}</Brow>)}
      <div className="flex w-full items-center gap-4 mb-8">
        <div className="relative shrink-0 size-18 overflow-hidden rounded-full border-2 border-indigo-500">
          <Image
            src={content.image.src}
            alt={content.image.alt}
            fill
            sizes="96px"
            className="object-cover object-center"
          />
        </div>
        <div className="">
          <Heading as="h2">{content.name}</Heading>
          <p className="mt-0.5">{content.role}</p>
        </div>
      </div>
      {content.paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-4">{paragraph}</p>
      ))}
      {content.cta && (
        <CTA>
          <Button asChild>
            <Link href={content.cta.href}>{content.cta.label}</Link>
          </Button>
          {content.cta.nextAvailability && (
            <NextAvailability memberSlug={content.cta.nextAvailability.memberSlug} />
          )}
        </CTA>
      )}
    </Section>
  )
}
