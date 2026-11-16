import { Kpi } from "@/components/finance/kpi"
import { RangeControls } from "@/components/finance/range-controls"
import { RevenueChart } from "@/components/finance/revenue-chart"
import { SyncStatus } from "@/components/finance/sync-status"
import { NoticeBar } from "@/components/molecules/notice-bar"
import { PageHeader } from "@/components/molecules/page-header"
import type { OutstandingInvoices } from "@/lib/db/invoices/get-outstanding-invoices"
import { buildInvoicesHref } from "@/lib/finance/build-invoices-href"
import type { RevenueChartRow } from "@/lib/finance/build-revenue-chart-data"
import type { RevenueRange } from "@/lib/finance/revenue-range"
import { formatMoney } from "@/lib/format/format-money"
import { Button } from "@lw/ui/components/button"
import { cn } from "@lw/ui/lib/utils"
import { Danger } from "@mynaui/icons-react"
import Link from "next/link"
import { Layout } from "../molecules/layout"

export type FinancesPageProps = {
  range: RevenueRange
  compare: boolean
  canCompare: boolean
  months: string[]
  chart: RevenueChartRow[]
  totalNetEurCents: number
  averageNetEurCents: number
  comparisonTotalNetEurCents: number | null
  invoiceCount: number
  outstanding: OutstandingInvoices
  unlinkedCustomers: number
  syncState: { lastSyncedAt: Date | null; lastError: string | null } | null
}

const invoices = (count: number) => (count === 1 ? "1 Rechnung" : `${count} Rechnungen`)

const percentChange = (current: number, previous: number) => {
  if (previous === 0) return null
  const change = Math.round(((current - previous) / Math.abs(previous)) * 100)
  return `${change > 0 ? "+" : ""}${change} % zum Vorjahr`
}

export const FinancesPage = (props: FinancesPageProps) => {
  const { outstanding } = props
  return (
    <Layout>
      <section>
        <PageHeader title="Finanzen" description="Umsatz netto nach Rechnungsdatum aus SevDesk. Entwürfe zählen nicht, Stornos und Gutschriften negativ.">
          <SyncStatus state={props.syncState} />
        </PageHeader>
        {props.syncState?.lastError ? (
          <NoticeBar tone="warning" icon={<Danger strokeWidth={1.5} className={cn("size-4 shrink-0")} />}>
            Letzter Sync fehlgeschlagen: {props.syncState.lastError}
          </NoticeBar>
        ) : null}
        <div className={cn("px-4 sm:px-8 lg:px-16")}>
          <RangeControls range={props.range} compare={props.compare} canCompare={props.canCompare} months={props.months} />
        </div>
        <dl className={cn("grid grid-cols-1 border-y border-neutral-200 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:px-16 dark:border-neutral-800")}>
          <Kpi
            label="Umsatz netto"
            value={formatMoney(props.totalNetEurCents, "EUR", { whole: true })}
            detail={
              props.comparisonTotalNetEurCents !== null
                ? (percentChange(props.totalNetEurCents, props.comparisonTotalNetEurCents) ?? invoices(props.invoiceCount))
                : invoices(props.invoiceCount)
            }
          />
          <Kpi label="Ø pro Monat" value={formatMoney(props.averageNetEurCents, "EUR", { whole: true })} detail="bis zum aktuellen Monat" />
          <Kpi label="Offen" value={formatMoney(outstanding.netEurCents, "EUR", { whole: true })} detail={<Link href={buildInvoicesHref({ view: "open" })} className={cn("hover:underline")}>{invoices(outstanding.count)}</Link>} />
          <Kpi
            label="Überfällig"
            value={formatMoney(outstanding.overdueNetEurCents, "EUR", { whole: true })}
            tone={outstanding.overdueCount > 0 ? "warning" : "default"}
            detail={<Link href={buildInvoicesHref({ view: "overdue" })} className={cn("hover:underline")}>{invoices(outstanding.overdueCount)}</Link>}
          />
        </dl>
        <div className={cn("px-4 py-8 sm:px-8 lg:px-16")}>
          <RevenueChart data={props.chart} showComparison={props.compare && props.canCompare} />
        </div>
        {props.unlinkedCustomers > 0 ? (
          <NoticeBar
            action={
              <Button variant="outline" size="sm" asChild>
                <Link href="/unternehmen">Unternehmen</Link>
              </Button>
            }
          >
            {props.unlinkedCustomers === 1 ? "1 SevDesk-Kunde mit Rechnungen ist" : `${props.unlinkedCustomers} SevDesk-Kunden mit Rechnungen sind`} noch keinem Unternehmen zugeordnet. Verknüpfe sie auf der jeweiligen Unternehmensseite.
          </NoticeBar>
        ) : null}
      </section>
    </Layout>
  )
}
