import { RemoteImage } from "@/components/atoms/remote-image"
import { ConnectContactsButton } from "@/components/contacts/connect-contacts-button"
import { formatContactName } from "@/lib/contacts/format-contact-name"
import { formatDisplayId } from "@/lib/contacts/format-display-id"
import { whatsAppHref } from "@/lib/contacts/whatsapp-href"
import type { ContactListItem } from "@/lib/db/contacts/list-visible-contacts"
import { tagSwatchColor } from "@/lib/tags/tag-swatch-color"
import { WhatsAppIcon } from "@lw/ui/atoms/custom-icons/whatsapp"
import { Avatar, AvatarFallback, AvatarImage } from "@lw/ui/components/avatar"
import { Button } from "@lw/ui/components/button"
import { Mail, Plus, Telephone } from "@mynaui/icons-react"
import Link from "next/link"
import { PageHeader } from "../molecules/page-header"

export const ContactsTable = ({
  contacts,
  needsContactsScope,
  proxied,
}: {
  contacts: ContactListItem[]
  needsContactsScope: boolean
  proxied: boolean
}) => {
  return (
    <section>
      <PageHeader title="Kontakte" description="Gemeinsames Adressbuch. Name, E-Mail, Telefon, WhatsApp und Geburtstag folgen in Google Kontakte.">
        <Button asChild>
          <Link href="/kontakte/new">
            <Plus strokeWidth={1.5} className="size-4" />
            <span>Neuer Kontakt</span>
          </Link>
        </Button>
      </PageHeader>
      {needsContactsScope ? (
        <div className="mx-16 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm">
          <p>Google Kontakte ist noch nicht verbunden. Neue Kontakte bleiben im OS, bis du den Zugriff erlaubst.</p>
          <ConnectContactsButton proxied={proxied} />
        </div>
      ) : null}
      <table className="w-full text-sm">
        <thead>
          <tr className="h-10 border-y border-neutral-200 dark:border-neutral-800">
            <td className="pr-2 pl-16">ID</td>
            <td className="pr-2">Name</td>
            <td className="pr-2">Unternehmen</td>
            <td className="pr-2">Tags</td>
            <td className="pr-16 text-right">Aktionen</td>
          </tr>
        </thead>
        <tbody>
          {contacts.length === 0 ? (
            <tr className="h-16 border-b border-neutral-200 dark:border-neutral-800">
              <td colSpan={5} className="px-16 text-neutral-500">Noch keine Kontakte.</td>
            </tr>
          ) : null}
          {contacts.map((contact) => {
            const name = formatContactName(contact.firstName, contact.lastName)
            const whatsApp = contact.whatsApp ? whatsAppHref(contact.whatsApp) : null
            return (
              <tr key={contact.displayId} className="h-10 border-b border-neutral-200 dark:border-neutral-800">
                <td className="pr-2 pl-16 font-mono text-neutral-400">{formatDisplayId(contact.displayId)}</td>
                <td className="pr-2">
                  <Link href={`/kontakte/${contact.displayId}`} className="flex items-center gap-1.5 font-medium text-black hover:underline dark:text-white">
                    <Avatar size="sm">
                      {contact.avatarUrl ? <AvatarImage src={contact.avatarUrl} alt="" /> : null}
                      <AvatarFallback>{initials(contact.firstName, contact.lastName)}</AvatarFallback>
                    </Avatar>
                    <span>{name}</span>
                  </Link>
                </td>
                <td className="pr-2">
                  {contact.company ? (
                    <Link href={`/unternehmen/${contact.company.id}`} className="inline-flex h-6 items-center gap-1.5 rounded-full border pr-2 pl-1.5 hover:bg-neutral-100 hover:text-black dark:hover:text-white">
                      {contact.company.logoUrl ? <RemoteImage src={contact.company.logoUrl} alt="" width={14} height={14} className="size-3.5" /> : null}
                      <span className="truncate">{contact.company.name}</span>
                    </Link>
                  ) : null}
                </td>
                <td className="pr-2">
                  <div className="inline-flex flex-wrap gap-1">
                    {contact.tags.map((tag) => (
                      <div key={tag.id} className="flex h-6 items-center gap-1.5 rounded-full border px-2">
                        <span className="size-2 rounded-full" style={{ backgroundColor: tagSwatchColor(tag.color) }} />
                        <span>{tag.name}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="pr-16">
                  <div className="flex items-center justify-end gap-2">
                    {contact.phone ? (
                      <Button variant="outline" size="icon-sm" asChild>
                        <a href={`tel:${contact.phone}`} aria-label={`${name} anrufen`}>
                          <Telephone strokeWidth={1.5} className="size-4" />
                        </a>
                      </Button>
                    ) : null}
                    {whatsApp ? (
                      <Button variant="outline" size="icon-sm" asChild>
                        <a href={whatsApp} aria-label={`${name} per WhatsApp schreiben`}>
                          <WhatsAppIcon className="size-4" />
                        </a>
                      </Button>
                    ) : null}
                    {contact.email ? (
                      <Button variant="outline" size="icon-sm" asChild>
                        <a href={`mailto:${contact.email}`} aria-label={`${name} schreiben`}>
                          <Mail strokeWidth={1.5} className="size-4" />
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

const initials = (firstName: string, lastName: string) =>
  [firstName, lastName].flatMap((part) => (part ? [part.slice(0, 1).toUpperCase()] : [])).join("")
