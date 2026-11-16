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
          {/* -mb-px lays the active tab's border onto the table's top border. */}
          <nav aria-label="Rechnungen filtern" className={cn("relative z-10 -mb-px flex flex-wrap gap-x-6 text-sm")}>
            {VIEW_TABS.map((tab) => (
              <Link
                key={tab.view}
                href={buildInvoicesHref({ view: tab.view, year, month })}
                scroll={false}
                aria-current={view === tab.view ? "page" : undefined}
                className={cn(
                  "border-b border-transparent pb-2.5 hover:text-black dark:hover:text-white",
                  view === tab.view && "border-black font-medium text-black dark:border-white dark:text-white",
                )}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
          {month ? null : (
            <nav aria-label="Jahr" className={cn("flex flex-wrap gap-x-4 pb-2.5 text-sm")}>
              {[null, ...years].map((option) => (
                <Link
                  key={option ?? "all"}
                  href={buildInvoicesHref({ view, year: option })}
                  scroll={false}
                  aria-current={year === option ? "page" : undefined}
                  className={cn("tabular-nums hover:text-black dark:hover:text-white", year === option && "font-medium text-black dark:text-white")}
                >
                  {option ?? "Alle Jahre"}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <InvoicesTable invoices={invoices} today={today} empty={EMPTY[view]} />
      </section>
    </Layout>
  )
}
