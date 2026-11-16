import { buildInvoicesHref } from "@/lib/finance/build-invoices-href"
import { formatMonth } from "@/lib/finance/format-month"
import type { DashboardFinances } from "@/lib/finance/get-dashboard-finances"
import { formatMoney } from "@/lib/format/format-money"
import { Heading } from "@lw/ui/atoms/heading"
import { cn } from "@lw/ui/lib/utils"
import { ArrowRight } from "@mynaui/icons-react"
import Link from "next/link"

/** Revenue this month and year plus open invoices, linking to /finanzen. */
export const DashboardFinancesTile = ({ finances }: { finances: DashboardFinances }) => {
  const { outstanding } = finances
  return (
    <div className={cn("border-b border-neutral-200 px-4 sm:px-8 lg:px-16 py-8 dark:border-neutral-800")}>
      <div className={cn("flex items-center justify-between gap-4")}>
        <Heading as="h2" size="h4">Finanzen</Heading>
        <Link href="/finanzen" className={cn("flex items-center gap-1 text-sm hover:text-black dark:hover:text-white")}>
          <span>Übersicht</span>
          <ArrowRight strokeWidth={1.5} className={cn("size-4")} />
        </Link>
      </div>
      <dl className={cn("mt-4 grid grid-cols-1 gap-x-8 gap-y-6 text-sm sm:grid-cols-3")}>
        <Item label={`Umsatz ${formatMonth(finances.month)}`}>{formatMoney(finances.monthNetEurCents, "EUR", { whole: true })}</Item>
        <Item label={`Umsatz ${finances.year}`}>{formatMoney(finances.yearNetEurCents, "EUR", { whole: true })}</Item>
        <Item label="Offen netto">
          <Link href={buildInvoicesHref({ view: "open" })} className={cn("hover:underline")}>
            {formatMoney(outstanding.netEurCents, "EUR", { whole: true })}
          </Link>
          <span className={cn("block font-normal")}>
            {outstanding.count === 1 ? "1 Rechnung" : `${outstanding.count} Rechnungen`}
            {outstanding.overdueCount > 0 ? (
              <>
                {" · "}
                <Link href={buildInvoicesHref({ view: "overdue" })} className={cn("text-amber-700 hover:underline dark:text-amber-400")}>{outstanding.overdueCount} überfällig</Link>
              </>
            ) : null}
          </span>
        </Item>
      </dl>
    </div>
  )
}

const Item = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <dt>{label}</dt>
    <dd className={cn("mt-1 text-xl font-medium tabular-nums text-black dark:text-white")}>{children}</dd>
  </div>
)
