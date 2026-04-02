import { Section } from "@/components/sections"
import Image from "next/image"

export type TestimonialSectionContent = {
  quote: string
  client: {
    name: string
    description: string
    avatar: string
  }
  logo: {
    srcDark: string
    srcLight: string
    alt: string
    width: number
    height: number
  }
}

export const TestimonialSection = ({ content }: { content: TestimonialSectionContent }) => {
  return (
    <Section verticalPadding="small">
      <blockquote className="text-xl italic">
        "{content.quote}"
      </blockquote>
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative overflow-hidden size-12 rounded-full border-2 border-indigo-500">
            <Image
              src={content.client.avatar}
              alt={content.client.name}
              fill
              className="object-cover object-center"
            />
          </div>
          <div className="text-black dark:text-white text-sm">
            <p className="font-medium">{content.client.name}</p>
            <p className="text-muted-foreground">{content.client.description}</p>
          </div>
        </div>
        <Image
          src={content.logo.srcLight}
          alt={content.logo.alt}
          width={content.logo.width}
          height={content.logo.height}
          className="h-7 w-auto dark:hidden"
        />
        <Image
          src={content.logo.srcDark}
          alt={content.logo.alt}
          width={content.logo.width}
          height={content.logo.height}
          className="h-7 w-auto hidden dark:block"
        />
      </div>
    </Section>
  )
}