import { Brow } from "@/components/atoms/brow"
import { LinkedInIcon } from "@/components/atoms/custom-icons/linkedin"
import { Mail, Telephone } from "@mynaui/icons-react"
import Link from "next/link"
import { Section } from ".."

export type ContactOptionsSectionContent = {
  id: string
  title: string
  description: string
  options: {
    label: string
    href: string
  }[]
}

export const ContactOptionsSection = ({ content }: { content?: ContactOptionsSectionContent }) => {
  return (
    <Section verticalPadding="none" horizontalPadding="none">
      <div className="grid grid-cols-3 divide-x divide-black/10 dark:divide-white/10">
        <Link href={`tel:${'047658293999'}`} target="_blank" rel="noopener noreferrer" className="py-8 px-16 group relative hover:bg-muted/50">
          <Brow variant="xs" className="mb-1">
            <span>Telefon/WhatsApp</span>
            <span className="sr-only">: </span>
          </Brow>
          <div className="relative">
            <Telephone aria-hidden="true" className="absolute mt-0.5 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <div className="text-black dark:text-white font-semibold text-sm group-hover:translate-x-5 transition-transform">
              +49 4765 829 3999
            </div>
          </div>
        </Link>
        <Link href={`mailto:${'lukas@lw.works'}`} target="_blank" rel="noopener noreferrer" className="py-8 px-16 group relative hover:bg-muted/50">
          <Brow variant="xs" className="mb-1">
            <span>Email</span>
            <span className="sr-only">: </span>
          </Brow>
          <div className="relative">
            <Mail aria-hidden="true" className="absolute mt-0.5 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <div className="text-black dark:text-white font-semibold text-sm group-hover:translate-x-5 transition-transform">
              lukas@lw.works
            </div>
          </div>
        </Link>
        <Link href="https://www.linkedin.com/in/lukasbrunkhorst/" target="_blank" rel="noopener noreferrer" className="py-8 px-16 group relative hover:bg-muted/50">
          <Brow variant="xs" className="mb-1">
            <span>LinkedIn</span>
            <span className="sr-only">: </span>
          </Brow>
          <div className="relative">
            <LinkedInIcon aria-hidden="true" className="absolute mt-0.5 group-hover:opacity-100 opacity-0 transition-opacity size-4 shrink-0 text-indigo-600 dark:text-indigo-400 pointer-events-none" />
            <div className="text-black dark:text-white font-semibold text-sm group-hover:translate-x-5 transition-transform">
              @lukasbrunkhorst
            </div>
          </div>
        </Link>
      </div>
    </Section>
  )
}