"use client"

import { CompanyPill } from "@/components/atoms/company-pill"
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
import { EmptyTableRow, SelectableTableHeader, SelectableTableRow, SelectionBar } from "@/components/molecules/selectable-table"
import { firstTextCell, lastTextCell, trailGutterCell } from "@/components/molecules/table-gutters"
import { useRowSelection } from "@/lib/selection/use-row-selection"
import { Table, TableBody, TableCell, TableHead } from "@lw/ui/components/table"
import { cn } from "@lw/ui/lib/utils"
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
  const selection = useRowSelection(contacts.map((contact) => String(contact.displayId)))
  const selectedCount = selection.selectedIds.length

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
      <Table className={cn("min-w-2xl")}>
        <SelectableTableHeader selection={selection} label="Alle Kontakte auswählen">
          <TableHead className={cn(firstTextCell)}>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Unternehmen</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead className={cn("text-right", lastTextCell)}>Aktionen</TableHead>
          <TableHead className={cn(trailGutterCell)} />
        </SelectableTableHeader>
        <TableBody>
          {contacts.length === 0 ? <EmptyTableRow columns={7}>Noch keine Kontakte.</EmptyTableRow> : null}
          {contacts.map((contact) => {
            const name = formatContactName(contact.firstName, contact.lastName)
            const whatsApp = contact.whatsApp ? whatsAppHref(contact.whatsApp) : null
            const voice = contact.phone ? googleVoiceHref(contact.phone) : null
            return (
              <SelectableTableRow key={contact.displayId} selection={selection} id={String(contact.displayId)} label={`${name} auswählen`}>
                <TableCell className={cn("font-mono text-neutral-400", firstTextCell)}>{formatDisplayId(contact.displayId)}</TableCell>
                <TableCell>
                  <Link href={`/kontakte/${contact.displayId}`} className="group flex items-center gap-1.5 font-medium text-black dark:text-white">
                    <Avatar size="sm">
                      {contact.avatarUrl ? <AvatarImage src={contact.avatarUrl} alt="" /> : null}
                      <AvatarFallback>{initials(contact.firstName, contact.lastName)}</AvatarFallback>
                    </Avatar>
                    <span className="group-hover:underline">{name}</span>
                  </Link>
                </TableCell>
                <TableCell className={cn("max-w-48")}>{contact.company ? <CompanyPill company={contact.company} /> : null}</TableCell>
                <TableCell>
                  <ContactTagsPicker displayId={contact.displayId} tags={tags} selectedIds={contact.tags.map((tag) => tag.id)} variant="compact" />
                </TableCell>
                <TableCell className={cn(lastTextCell)}>
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
                </TableCell>
                <TableCell className={cn(trailGutterCell)} />
              </SelectableTableRow>
            )
          })}
        </TableBody>
      </Table>
      <SelectionBar selection={selection} label="Ausgewählte Kontakte" count={selectedCount === 1 ? "1 Kontakt" : `${selectedCount} Kontakte`} />
    </section>
  )
}

const initials = (firstName: string, lastName: string) =>
  [firstName, lastName].flatMap((part) => (part ? [part.slice(0, 1).toUpperCase()] : [])).join("")

