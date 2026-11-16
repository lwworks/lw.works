import { InvoicesTable } from "@/components/finance/invoices-table"
import { SevdeskContactPicker } from "@/components/finance/sevdesk-contact-picker"
import { UnlinkSevdeskContactButton } from "@/components/finance/unlink-sevdesk-contact-button"
import type { CompanyFinances as CompanyFinancesData } from "@/lib/finance/get-company-finances"
import { formatMoney } from "@/lib/format/format-money"
import { getSevdeskContactUrl } from "@/lib/sevdesk/get-sevdesk-contact-url"
import { Heading } from "@lw/ui/atoms/heading"
import { Button } from "@lw/ui/components/button"
import { cn } from "@lw/ui/lib/utils"
import { ExternalLink } from "@mynaui/icons-react"

/** SevDesk section of the company page (admins only): link a customer, then its numbers and invoices. */
export const CompanyFinances = ({ companyId, finances }: { companyId: string; finances: CompanyFinancesData }) => {
  const { customer, linked } = finances
  if (!customer || !linked) {
    return (
      <div className={cn("border-b border-neutral-200 px-4 sm:px-8 lg:px-16 py-8 dark:border-neutral-800")}>
        <Heading as="h2" size="h4">SevDesk</Heading>
        <p className={cn("mt-1 text-sm")}>Noch nicht mit einem SevDesk-Kunden verknüpft. Danach erscheinen hier Kundennummer, Umsatz und Rechnungen.</p>
        <SevdeskContactPicker companyId={companyId} contacts={finances.contacts} suggestion={finances.suggestion} />
      </div>
    )
  }
  return (
    <div>
      <div className={cn("px-4 sm:px-8 lg:px-16 pt-8 pb-6")}>
        <div className={cn("flex flex-wrap items-center justify-between gap-3")}>
          <Heading as="h2" size="h4">SevDesk</Heading>
          <div className={cn("flex items-center gap-2")}>
            <UnlinkSevdeskContactButton companyId={companyId} />
            <Button variant="outline" size="sm" asChild>
              <a href={getSevdeskContactUrl(customer.id)} target="_blank" rel="noreferrer">
                <ExternalLink strokeWidth={1.5} />
                <span>In SevDesk öffnen</span>
              </a>
            </Button>
          </div>
        </div>
        <dl className={cn("mt-4 grid grid-cols-2 gap-x-8 gap-y-6 text-sm sm:grid-cols-4")}>
          <Item label="Kundennummer">{customer.customerNumber ?? "–"}</Item>
          <Item label="Umsatz netto gesamt">{formatMoney(linked.totalNetEurCents, "EUR", { whole: true })}</Item>
          <Item label={`Umsatz ${finances.today.slice(0, 4)}`}>{formatMoney(linked.yearNetEurCents, "EUR", { whole: true })}</Item>
          <Item label="Offen netto">
            {formatMoney(linked.outstanding.netEurCents, "EUR", { whole: true })}
            {linked.outstanding.overdueCount > 0 ? <span className={cn("block font-normal text-amber-700 dark:text-amber-400")}>{linked.outstanding.overdueCount} überfällig</span> : null}
          </Item>
        </dl>
        <p className={cn("mt-4 text-xs")}>SevDesk-Kunde: {customer.name}</p>
      </div>
      <InvoicesTable invoices={linked.invoices} today={finances.today} hideCustomer empty="Noch keine Rechnungen." />
    </div>
  )
}

const Item = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <dt>{label}</dt>
    <dd className={cn("mt-1 font-medium tabular-nums text-black dark:text-white")}>{children}</dd>
  </div>
)
