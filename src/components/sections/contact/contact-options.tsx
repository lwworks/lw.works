import { Brow } from "@/components/atoms/brow"
import { LinkedInIcon } from "@/components/atoms/custom-icons/linkedin"
import { ProtectedEmail, ProtectedPhone } from "@/components/atoms/protected-contact"
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
        <ProtectedPhone phone="+49 4765 829 3999" className="py-8 px-16 group relative hover:bg-muted/50">
          <Brow variant="xs" className="mb-1">
            <span>Telefon/WhatsApp</span>
            <span className="sr-only">: </span>
          </Brow>
          <div className="relative">
            <Telephone aria-hidden="true" className="absolute mt-0.5 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <div className="text-black dark:text-white font-semibold text-sm group-hover:translate-x-5 transition-transform">
              <ProtectedPhone phone="+49 4765 829 3999" asText />
            </div>
          </div>
        </ProtectedPhone>
        <ProtectedEmail email="lukas@lw.works" className="py-8 px-16 group relative hover:bg-muted/50">
          <Brow variant="xs" className="mb-1">
            <span>Email</span>
            <span className="sr-only">: </span>
          </Brow>
          <div className="relative">
            <Mail aria-hidden="true" className="absolute mt-0.5 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <div className="text-black dark:text-white font-semibold text-sm group-hover:translate-x-5 transition-transform">
              <ProtectedEmail email="lukas@lw.works" asText />
            </div>
          </div>
        </ProtectedEmail>
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
