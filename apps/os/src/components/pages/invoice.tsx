import { CompanyIcon } from "@/components/atoms/company-icon"
import { InvoicePositions, InvoicePositionsSkeleton } from "@/components/finance/invoice-positions"
import { InvoiceStateBadge } from "@/components/finance/invoice-state-badge"
import type { InvoiceDetail } from "@/lib/db/invoices/get-invoice"
import { formatDateKeyDe } from "@/lib/finance/format-date-key-de"
import { getInvoiceState } from "@/lib/finance/get-invoice-state"
import { formatMoney } from "@/lib/format/format-money"
import { getSevdeskDocumentUrl } from "@/lib/sevdesk/get-sevdesk-document-url"
import { Heading } from "@lw/ui/atoms/heading"
import { Button } from "@lw/ui/components/button"
import { cn } from "@lw/ui/lib/utils"
import { ArrowLeft, ExternalLink, FileText } from "@mynaui/icons-react"
import Link from "next/link"
import { Suspense } from "react"
import { Layout } from "../molecules/layout"

const KIND_TITLES = { invoice: "Rechnung", cancellation: "Stornorechnung", credit_note: "Gutschrift" } as const

export const InvoicePage = ({ invoice, today }: { invoice: InvoiceDetail; today: string }) => {
  const isForeign = invoice.currency !== "EUR"
  const taxEurCents = invoice.grossEurCents - invoice.netEurCents
  return (
    <Layout>
      <section>
        <div className={cn("border-b border-neutral-200 px-4 sm:px-8 lg:px-16 pt-9 pb-8 dark:border-neutral-800")}>
          <Link href="/finanzen/rechnungen" className={cn("mb-4 flex w-fit items-center gap-1 text-sm hover:text-black dark:hover:text-white")}>
            <ArrowLeft strokeWidth={1.5} className={cn("size-4")} />
            <span>Rechnungen</span>
          </Link>
          <div className={cn("flex flex-wrap items-center justify-between gap-4")}>
            <div className={cn("flex min-w-0 flex-col gap-1")}>
              <span className={cn("text-sm")}>{KIND_TITLES[invoice.kind]}</span>
              <div className={cn("flex items-center gap-3")}>
                <Heading as="h1" size="h2" className={cn("truncate tabular-nums")}>{invoice.number ?? "Entwurf"}</Heading>
                <InvoiceStateBadge state={getInvoiceState(invoice, today)} />
              </div>
            </div>
            <div className={cn("flex shrink-0 items-center gap-2")}>
              <Button variant="outline" asChild>
                <a href={`/finanzen/rechnungen/${invoice.id}/pdf`} target="_blank" rel="noreferrer">
                  <FileText strokeWidth={1.5} className={cn("size-4")} />
                  <span>PDF öffnen</span>
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={getSevdeskDocumentUrl(invoice)} target="_blank" rel="noreferrer">
                  <ExternalLink strokeWidth={1.5} className={cn("size-4")} />
                  <span>In SevDesk öffnen</span>
                </a>
              </Button>
            </div>
          </div>
          {invoice.subject ? <p className={cn("mt-3 text-sm text-black dark:text-white")}>{invoice.subject}</p> : null}
          {invoice.cancellation ? (
            <p className={cn("mt-3 text-sm")}>
              Storniert durch{" "}
              <Link href={`/finanzen/rechnungen/${invoice.cancellation.id}`} className={cn("font-medium text-black underline dark:text-white")}>{invoice.cancellation.number ?? "Entwurf"}</Link>.
            </p>
          ) : null}
          {invoice.original ? (
            <p className={cn("mt-3 text-sm")}>
              Zu Rechnung{" "}
              <Link href={`/finanzen/rechnungen/${invoice.original.id}`} className={cn("font-medium text-black underline dark:text-white")}>{invoice.original.number ?? "Entwurf"}</Link>.
            </p>
          ) : null}
        </div>

        <dl className={cn("grid grid-cols-1 gap-x-8 gap-y-6 border-b border-neutral-200 px-4 sm:px-8 lg:px-16 py-8 text-sm sm:grid-cols-3 dark:border-neutral-800")}>
          <Item label="Kunde">
            {invoice.company ? (
              <Link href={`/unternehmen/${invoice.company.id}`} className={cn("inline-flex items-center gap-1.5 hover:underline")}>
                <CompanyIcon companyId={invoice.company.id} logoKey={invoice.company.logoKey} />
                <span>{invoice.company.name}</span>
              </Link>
            ) : (
              <span>{invoice.customer?.name ?? invoice.contactName}</span>
            )}
            {invoice.customer?.customerNumber ? <span className={cn("block font-normal")}>Kundennummer {invoice.customer.customerNumber}</span> : null}
          </Item>
          <Item label="Rechnungsdatum">{formatDateKeyDe(invoice.invoiceDate)}</Item>
          <Item label={invoice.paidAt ? "Bezahlt am" : "Fällig am"}>{formatDateKeyDe(invoice.paidAt ?? invoice.dueDate) || "–"}</Item>
          <Item label="Netto">
            <span className={cn("tabular-nums")}>{formatMoney(invoice.netEurCents)}</span>
            {isForeign ? <span className={cn("block font-normal tabular-nums")}>{formatMoney(invoice.netCents, invoice.currency)}</span> : null}
          </Item>
          <Item label="USt.">
            <span className={cn("tabular-nums")}>{formatMoney(taxEurCents)}</span>
          </Item>
          <Item label="Brutto">
            <span className={cn("tabular-nums")}>{formatMoney(invoice.grossEurCents)}</span>
            {isForeign ? (
              <span className={cn("block font-normal tabular-nums")}>
                {formatMoney(invoice.grossCents, invoice.currency)} · Kurs {(invoice.netCents / (invoice.netEurCents || 1)).toLocaleString("de-DE", { maximumFractionDigits: 4 })}
              </span>
            ) : null}
            {invoice.status === "partially_paid" ? <span className={cn("block font-normal tabular-nums")}>{formatMoney(invoice.paidEurCents)} bezahlt</span> : null}
          </Item>
        </dl>

        <div className={cn("px-4 sm:px-8 lg:px-16 pt-8 pb-4")}>
          <Heading as="h2" size="h4">Positionen</Heading>
          {isForeign ? <p className={cn("mt-1 text-sm")}>Beträge in {invoice.currency}, wie auf der Rechnung.</p> : null}
        </div>
        <Suspense fallback={<InvoicePositionsSkeleton />}>
          <InvoicePositions invoice={invoice} />
        </Suspense>
      </section>
    </Layout>
  )
}

const Item = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <dt>{label}</dt>
    <dd className={cn("mt-1 font-medium text-black dark:text-white")}>{children}</dd>
  </div>
)
