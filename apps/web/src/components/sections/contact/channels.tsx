import { WhatsAppIcon } from "@lw/ui/atoms/custom-icons/whatsapp"
import { Section } from "@/components/sections"
import { company } from "@/content/company"
import { Mail, Telephone } from "@mynaui/icons-react"
import Link from "next/link"

const linkClassName = "flex items-center gap-2 py-2 md:py-4 transition-colors hover:text-black dark:hover:text-white"

export const ContactChannelsSection = () => {
  return (
    <Section verticalPadding="none" background="darker">
      <div className="py-4 md:flex md:items-center md:gap-8">
        <Link href={`mailto:${company.email}`} target="_blank" rel="noopener noreferrer" className={linkClassName}>
          <Mail className="size-4" />
          <span>{company.email}</span>
        </Link>
        <Link href={`tel:${company.phone.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className={linkClassName}>
          <Telephone className="size-4" />
          <span>{company.phone}</span>
        </Link>
        <Link href={company.whatsApp} target="_blank" rel="noopener noreferrer" className={linkClassName}>
          <WhatsAppIcon className="size-4" />
          <span>WhatsApp</span>
        </Link>
      </div>
    </Section>
  )
}
