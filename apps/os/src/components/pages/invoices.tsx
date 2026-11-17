import { InvoicesTable } from "@/components/finance/invoices-table"
import { PageHeader } from "@/components/molecules/page-header"
import type { InvoiceView } from "@/lib/db/invoices/invoice-view"
import type { InvoiceListItem } from "@/lib/db/invoices/list-invoices"
import { buildInvoicesHref } from "@/lib/finance/build-invoices-href"
import { formatMonth } from "@/lib/finance/format-month"
import { formatMoney } from "@/lib/format/format-money"
import { Button } from "@lw/ui/components/button"
import { cn } from "@lw/ui/lib/utils"
import { X } from "@mynaui/icons-react"
import Link from "next/link"
import { Layout } from "../molecules/layout"
import { TabLink, TabNav } from "@/components/molecules/tabs"

const VIEW_TABS: { view: InvoiceView; label: string }[] = [
  { view: "all", label: "Alle" },
  { view: "draft", label: "Entwürfe" },
  { view: "open", label: "Offen" },
  { view: "overdue", label: "Überfällig" },
  { view: "paid", label: "Bezahlt" },
]

const EMPTY: Record<InvoiceView, string> = {
  all: "Keine Rechnungen.",
  draft: "Keine Entwürfe.",
  open: "Keine offenen Rechnungen.",
  overdue: "Keine überfälligen Rechnungen.",
  paid: "Keine bezahlten Rechnungen.",
}

export const InvoicesPage = ({
  invoices,
  view,
  year,
  month,
  years,
  today,
}: {
  invoices: InvoiceListItem[]
  view: InvoiceView
  year: number | null
  month: string | null
  years: number[]
  today: string
}) => {
  const total = invoices.filter((invoice) => invoice.status !== "draft").reduce((sum, invoice) => sum + invoice.netEurCents, 0)
  return (
    <Layout>
      <section>
        <PageHeader
          title="Rechnungen"
          description={`${invoices.length === 1 ? "1 Beleg" : `${invoices.length} Belege`} · ${formatMoney(total)} netto (ohne Entwürfe)`}
        >
          {month ? (
            <Button variant="outline" asChild>
              <Link href={buildInvoicesHref({ view })}>
                <span>{formatMonth(month)}</span>
                <X strokeWidth={1.5} className={cn("size-4")} />
              </Link>
            </Button>
          ) : null}
        </PageHeader>
        <div className={cn("flex flex-wrap items-end justify-between gap-x-6 gap-y-3 px-4 sm:px-8 lg:px-16")}>
          <TabNav aria-label="Rechnungen filtern">
            {VIEW_TABS.map((tab) => (
              <TabLink key={tab.view} href={buildInvoicesHref({ view: tab.view, year, month })} active={view === tab.view}>
                {tab.label}
              </TabLink>
            ))}
          </TabNav>
          {year === null ? null : (
            <TabNav aria-label="Jahr">
              {years.map((option) => (
                <TabLink key={option} href={buildInvoicesHref({ view, year: option })} active={year === option} className={cn("tabular-nums")}>
                  {option}
                </TabLink>
              ))}
            </TabNav>
          )}
        </div>
        <InvoicesTable invoices={invoices} today={today} empty={EMPTY[view]} />
      </section>
    </Layout>
  )
}
