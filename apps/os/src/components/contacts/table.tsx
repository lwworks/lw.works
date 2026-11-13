import { CompanyIcon } from "@/components/atoms/company-icon"
import { ConnectContactsButton } from "@/components/contacts/connect-contacts-button"
import { ContactTagsPicker } from "@/components/contacts/contact-tags-picker"
import { formatContactName } from "@/lib/contacts/format-contact-name"
import { formatDisplayId } from "@/lib/contacts/format-display-id"
import { whatsAppHref } from "@/lib/contacts/whatsapp-href"
import type { ContactListItem } from "@/lib/db/contacts/list-visible-contacts"
import { googleVoiceHref } from "@/lib/contacts/google-voice-href"
import type { TagListItem } from "@/lib/db/tags/list-tags"
import { WhatsAppIcon } from "@lw/ui/atoms/custom-icons/whatsapp"
import { Avatar, AvatarFallback, AvatarImage } from "@lw/ui/components/avatar"
import { Button } from "@lw/ui/components/button"
import { Mail, Plus, Telephone } from "@mynaui/icons-react"
import Link from "next/link"
import { NoticeBar } from "../molecules/notice-bar"
import { PageHeader } from "../molecules/page-header"

export const ContactsTable = ({
  contacts,
  tags,
  needsContactsScope,
  proxied,
}: {
  contacts: ContactListItem[]
  tags: TagListItem[]
  needsContactsScope: boolean
  proxied: boolean
}) => {
  return (
    <section>
      <PageHeader title="Kontakte" description="Gemeinsames Adressbuch. Name, E-Mail-Adressen, Telefonnummern, WhatsApp und Geburtstag folgen in Google Kontakte.">
        <Button asChild>
          <Link href="/kontakte/neu">
            <Plus strokeWidth={1.5} className="size-4" />
            <span>Neuer Kontakt</span>
          </Link>
        </Button>
      </PageHeader>
      {needsContactsScope ? (
        <NoticeBar action={<ConnectContactsButton proxied={proxied} />}>
          Google Kontakte ist noch nicht verbunden. Neue Kontakte bleiben im OS, bis du den Zugriff erlaubst.
        </NoticeBar>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-2xl">
          <thead>
            <tr className="h-10 border-y border-neutral-200 dark:border-neutral-800">
              <td className="pr-2 pl-4 sm:pl-8 lg:pl-16">ID</td>
              <td className="pr-2">Name</td>
              <td className="pr-2">Unternehmen</td>
              <td className="pr-2">Tags</td>
              <td className="pr-4 sm:pr-8 lg:pr-16 text-right">Aktionen</td>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr className="h-16 border-b border-neutral-200 dark:border-neutral-800">
                <td colSpan={5} className="px-4 sm:px-8 lg:px-16 text-neutral-500">Noch keine Kontakte.</td>
              </tr>
            ) : null}
            {contacts.map((contact) => {
              const name = formatContactName(contact.firstName, contact.lastName)
              const whatsApp = contact.whatsApp ? whatsAppHref(contact.whatsApp) : null
              const voice = contact.phone ? googleVoiceHref(contact.phone) : null
              return (
                <tr key={contact.displayId} className="h-10 border-b border-neutral-200 dark:border-neutral-800">
                  <td className="pr-2 pl-4 sm:pl-8 lg:pl-16 font-mono text-neutral-400">{formatDisplayId(contact.displayId)}</td>
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
                        <CompanyIcon companyId={contact.company.id} logoKey={contact.company.logoKey} />
                        <span className="truncate">{contact.company.name}</span>
                      </Link>
                    ) : null}
                  </td>
                  <td className="pr-2">
                    <ContactTagsPicker displayId={contact.displayId} tags={tags} selectedIds={contact.tags.map((tag) => tag.id)} variant="compact" />
                  </td>
                  <td className="pr-4 sm:pr-8 lg:pr-16">
                    <div className="flex items-center justify-end gap-2">
                      {voice ? (
                        <Button variant="outline" size="icon-sm" asChild>
                          <a href={voice} target="_blank" rel="noopener noreferrer" aria-label={`${name} mit Google Voice anrufen`}>
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
      </div>
    </section>
  )
}

const initials = (firstName: string, lastName: string) =>
  [firstName, lastName].flatMap((part) => (part ? [part.slice(0, 1).toUpperCase()] : [])).join("")

