import { RemoteImage } from "@/components/atoms/remote-image"
import { DeleteContactButton } from "@/components/contacts/delete-contact-button"
import { EditContactDialog } from "@/components/contacts/contact-form"
import { PrivacySwitch } from "@/components/contacts/privacy-switch"
import { formatBirthday } from "@/lib/contacts/format-birthday"
import { formatContactName } from "@/lib/contacts/format-contact-name"
import { formatDisplayId } from "@/lib/contacts/format-display-id"
import type { CompanyListItem } from "@/lib/db/companies/list-companies"
import type { ContactDetail } from "@/lib/db/contacts/get-visible-contact"
import type { TagListItem } from "@/lib/db/tags/list-tags"
import { tagSwatchColor } from "@/lib/tags/tag-swatch-color"
import { InstagramIcon } from "@lw/ui/atoms/custom-icons/instagram"
import { LinkedInIcon } from "@lw/ui/atoms/custom-icons/linkedin"
import { WhatsAppIcon } from "@lw/ui/atoms/custom-icons/whatsapp"
import { XIcon } from "@lw/ui/atoms/custom-icons/x"
import { Heading } from "@lw/ui/atoms/heading"
import { Avatar, AvatarFallback, AvatarImage } from "@lw/ui/components/avatar"
import { ArrowLeft, At, Gift, Telephone, UserSquare } from "@mynaui/icons-react"
import Link from "next/link"
import type { ReactNode } from "react"

export const ContactDetails = ({
  contact,
  companies,
  tags,
}: {
  contact: ContactDetail
  companies: CompanyListItem[]
  tags: TagListItem[]
}) => {
  const name = formatContactName(contact.firstName, contact.lastName)
  return (
    <section>
      <div className="border-b border-neutral-200 px-4 sm:px-8 lg:px-16 pt-9 pb-8 dark:border-neutral-800">
        <div className="mb-4 flex items-center gap-2 text-sm">
          <Link href="/kontakte" className="flex items-center gap-1 hover:text-black dark:hover:text-white">
            <ArrowLeft strokeWidth={1.5} className="size-4" />
            <span>Kontakte</span>
          </Link>
          <span>{"//"}</span>
          <span className="font-mono">{formatDisplayId(contact.displayId)}</span>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="size-15 border">
            {contact.avatarUrl ? <AvatarImage src={contact.avatarUrl} alt="" /> : null}
            <AvatarFallback>{initials(contact.firstName, contact.lastName)}</AvatarFallback>
          </Avatar>
          <div>
            <Heading as="h1" size="h2">{name}</Heading>
            {contact.company ? (
              <Link href={`/unternehmen/${contact.company.id}`} className="inline-flex h-6 items-center gap-1.5 rounded-full border pr-2 pl-1.5 text-sm hover:bg-neutral-100 hover:text-black dark:hover:text-white">
                {contact.company.logoUrl ? <RemoteImage src={contact.company.logoUrl} alt="" width={14} height={14} className="size-3.5" /> : null}
                <span className="truncate">{contact.company.name}</span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 divide-y divide-neutral-200 border-b border-neutral-200 md:grid-cols-2 md:divide-x md:divide-y-0 dark:divide-neutral-800 dark:border-neutral-800">
        <div className="px-4 py-8 sm:px-8 lg:pl-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Heading as="h2" size="h4">Details</Heading>
            <EditContactDialog
              companies={companies}
              tags={tags}
              contact={{
                displayId: contact.displayId,
                firstName: contact.firstName,
                lastName: contact.lastName,
                email: contact.email,
                phone: contact.phone,
                whatsApp: contact.whatsApp,
                linkedIn: contact.linkedIn,
                instagram: contact.instagram,
                x: contact.x,
                avatarUrl: contact.avatarUrl,
                birthday: contact.birthday,
                companyId: contact.companyId,
                tagIds: contact.tagIds,
                isPrivate: contact.isPrivate,
              }}
              canTogglePrivacy={contact.canEditPrivacy}
            />
          </div>
          <table className="mt-4 w-full text-sm">
            <tbody>
              <Detail icon={<UserSquare strokeWidth={1.5} className="mb-0.5 inline size-4" />} label="Vorname" value={contact.firstName} />
              <Detail icon={<UserSquare strokeWidth={1.5} className="mb-0.5 inline size-4" />} label="Nachname" value={contact.lastName} />
              <Detail icon={<Gift className="mb-0.5 inline size-4" />} label="Geburtstag" value={formatBirthday(contact.birthday)} />
              <Detail icon={<At strokeWidth={1.5} className="mb-0.5 inline size-4" />} label="E-Mail" value={contact.email} />
              <Detail icon={<Telephone strokeWidth={1.5} className="mb-0.5 inline size-4" />} label="Telefon" value={contact.phone} />
              <Detail icon={<WhatsAppIcon className="mb-0.5 inline size-4" />} label="WhatsApp" value={contact.whatsApp} />
              <Detail icon={<LinkedInIcon className="mb-0.5 inline size-4" />} label="LinkedIn" value={contact.linkedIn} />
              <Detail icon={<InstagramIcon className="mb-0.5 inline size-4" />} label="Instagram" value={contact.instagram} />
              <Detail icon={<XIcon className="mb-0.5 inline size-4" />} label="X" value={contact.x} />
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-6 px-4 py-8 sm:px-8 lg:pr-16">
          <div>
            <Heading as="h2" size="h4">Tags</Heading>
            <div className="mt-3 flex flex-wrap gap-1">
              {contact.tags.length === 0 ? <p className="text-sm">Keine Tags.</p> : null}
              {contact.tags.map((tag) => (
                <div key={tag.id} className="flex h-6 items-center gap-1.5 rounded-full border px-2 text-sm">
                  <span className="size-2 rounded-full" style={{ backgroundColor: tagSwatchColor(tag.color) }} />
                  <span>{tag.name}</span>
                </div>
              ))}
            </div>
          </div>
          {contact.canEditPrivacy ? <PrivacySwitch displayId={contact.displayId} isPrivate={contact.isPrivate} /> : null}
          <DeleteContactButton displayId={contact.displayId} />
        </div>
      </div>
    </section>
  )
}

const Detail = ({ icon, label, value }: { icon: ReactNode; label: string; value: string | null }) => (
  <tr className="h-8">
    <td className="pr-4">
      {icon}
      <span className="ml-1">{label}</span>
    </td>
    <td className="font-medium text-black dark:text-white">{value || "—"}</td>
  </tr>
)

const initials = (firstName: string, lastName: string) =>
  [firstName, lastName].flatMap((part) => (part ? [part.slice(0, 1).toUpperCase()] : [])).join("")
