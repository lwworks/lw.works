import { CompanyIcon } from "@/components/atoms/company-icon"
import { DeleteContactButton } from "@/components/contacts/delete-contact-button"
import { ContactTagsPicker } from "@/components/contacts/contact-tags-picker"
import { EditContactDialog } from "@/components/contacts/contact-form"
import { PrivacySwitch } from "@/components/contacts/privacy-switch"
import { formatBirthday } from "@/lib/contacts/format-birthday"
import { formatContactName } from "@/lib/contacts/format-contact-name"
import { formatDisplayId } from "@/lib/contacts/format-display-id"
import { formatValueType } from "@/lib/contacts/format-value-type"
import type { ContactLabeledValue } from "@/lib/db/schema/crm"
import type { CompanyListItem } from "@/lib/db/companies/list-companies"
import type { ContactDetail } from "@/lib/db/contacts/get-visible-contact"
import type { TagListItem } from "@/lib/db/tags/list-tags"
import { InstagramIcon } from "@lw/ui/atoms/custom-icons/instagram"
import { LinkedInIcon } from "@lw/ui/atoms/custom-icons/linkedin"
import { WhatsAppIcon } from "@lw/ui/atoms/custom-icons/whatsapp"
import { XIcon } from "@lw/ui/atoms/custom-icons/x"
import { Heading } from "@lw/ui/atoms/heading"
import { Avatar, AvatarFallback, AvatarImage } from "@lw/ui/components/avatar"
import { ArrowLeft, At, Building, Gift, Lock, Telephone, UserSquare, Users } from "@mynaui/icons-react"
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
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 border-b border-neutral-200 lg:grid-cols-[minmax(0,1fr)_20rem] dark:border-neutral-800">
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
                emails: contact.emails,
                phones: contact.phones,
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
              <LabeledValuesDetail icon={<At strokeWidth={1.5} className="mb-0.5 inline size-4" />} label="E-Mail" values={contact.emails} href={(value) => `mailto:${value}`} />
              <LabeledValuesDetail icon={<Telephone strokeWidth={1.5} className="mb-0.5 inline size-4" />} label="Telefon" values={contact.phones} href={(value) => `tel:${value.replace(/[^\d+]/g, "")}`} />
              <Detail icon={<WhatsAppIcon className="mb-0.5 inline size-4" />} label="WhatsApp" value={contact.whatsApp} />
              <Detail icon={<LinkedInIcon className="mb-0.5 inline size-4" />} label="LinkedIn" value={contact.linkedIn} />
              <Detail icon={<InstagramIcon className="mb-0.5 inline size-4" />} label="Instagram" value={contact.instagram} />
              <Detail icon={<XIcon className="mb-0.5 inline size-4" />} label="X" value={contact.x} />
            </tbody>
          </table>
        </div>
        <aside className="flex flex-col gap-8 border-t border-neutral-200 px-4 py-8 sm:px-8 lg:border-t-0 lg:border-l lg:pr-16 lg:pl-6 dark:border-neutral-800">
          <SidebarGroup title="Eigenschaften">
            <SidebarRow icon={<Building strokeWidth={1.5} className="size-4" />}>
              {contact.company ? (
                <Link href={`/unternehmen/${contact.company.id}`} className="flex min-w-0 items-center gap-2 font-medium text-black hover:underline dark:text-white">
                  <CompanyIcon companyId={contact.company.id} logoKey={contact.company.logoKey} size={16} />
                  <span className="truncate">{contact.company.name}</span>
                </Link>
              ) : (
                <span>Kein Unternehmen</span>
              )}
            </SidebarRow>
            {contact.canEditPrivacy ? (
              <PrivacySwitch displayId={contact.displayId} isPrivate={contact.isPrivate} />
            ) : (
              <SidebarRow icon={contact.isPrivate ? <Lock strokeWidth={1.5} className="size-4" /> : <Users strokeWidth={1.5} className="size-4" />}>
                <span className="font-medium text-black dark:text-white">{contact.isPrivate ? "Privat" : "Geteilt"}</span>
              </SidebarRow>
            )}
          </SidebarGroup>
          <SidebarGroup title="Tags">
            <ContactTagsPicker displayId={contact.displayId} tags={tags} selectedIds={contact.tags.map((tag) => tag.id)} />
          </SidebarGroup>
          <div className="mt-auto">
            <DeleteContactButton displayId={contact.displayId} />
          </div>
        </aside>
      </div>
    </section>
  )
}

const SidebarGroup = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-sm">{title}</h2>
    <div className="flex flex-col gap-2.5 text-sm">{children}</div>
  </div>
)

const SidebarRow = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => (
  <div className="flex min-h-6 items-center gap-2">
    <span className="flex size-4 shrink-0 items-center justify-center">{icon}</span>
    {children}
  </div>
)

const Detail = ({ icon, label, value }: { icon: ReactNode; label: string; value: string | null }) => (
  <tr className="h-8">
    <td className="pr-4">
      {icon}
      <span className="ml-1">{label}</span>
    </td>
    <td className="font-medium text-black dark:text-white">{value || "—"}</td>
  </tr>
)

/** One table row per email or phone; the label column is only filled on the first. */
const LabeledValuesDetail = ({
  icon,
  label,
  values,
  href,
}: {
  icon: ReactNode
  label: string
  values: ContactLabeledValue[]
  href: (value: string) => string
}) => {
  if (values.length === 0) return <Detail icon={icon} label={label} value={null} />
  return values.map((entry, index) => (
    <tr key={`${entry.value}-${index}`} className="h-8">
      <td className="pr-4">
        {index === 0 ? (
          <>
            {icon}
            <span className="ml-1">{label}</span>
          </>
        ) : null}
      </td>
      <td>
        <a href={href(entry.value)} className="font-medium text-black hover:underline dark:text-white">{entry.value}</a>
        {entry.type ? <span className="ml-2 text-neutral-500">{formatValueType(entry.type)}</span> : null}
      </td>
    </tr>
  ))
}

const initials = (firstName: string, lastName: string) =>
  [firstName, lastName].flatMap((part) => (part ? [part.slice(0, 1).toUpperCase()] : [])).join("")
