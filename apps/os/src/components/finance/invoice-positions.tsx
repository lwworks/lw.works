import type { InvoiceDetail } from "@/lib/db/invoices/get-invoice"
import { loadInvoicePositions } from "@/lib/finance/load-invoice-positions"
import { formatMoney } from "@/lib/format/format-money"
import { Skeleton } from "@lw/ui/components/skeleton"
import { cn } from "@lw/ui/lib/utils"

const quantityFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 })

/** Line items, loaded live from SevDesk while the rest of the page is already shown. */
export const InvoicePositions = async ({ invoice }: { invoice: InvoiceDetail }) => {
  const result = await loadInvoicePositions(invoice)
  if (!result.ok) return <p className={cn("px-4 py-6 text-sm sm:px-8 lg:px-16")}>Positionen konnten nicht geladen werden: {result.message}</p>
  return (
    <div className={cn("overflow-x-auto")}>
      <table className={cn("w-full min-w-xl text-sm")}>
        <thead>
          <tr className={cn("h-10 border-y border-neutral-200 dark:border-neutral-800")}>
            <td className={cn("pr-2 pl-4 sm:pl-8 lg:pl-16")}>Position</td>
            <td className={cn("pr-2 text-right whitespace-nowrap")}>Menge</td>
            <td className={cn("pr-2 text-right whitespace-nowrap")}>Einzelpreis</td>
            <td className={cn("pr-2 text-right whitespace-nowrap")}>USt.</td>
            <td className={cn("pr-4 text-right whitespace-nowrap sm:pr-8 lg:pr-16")}>Netto</td>
          </tr>
        </thead>
        <tbody>
          {result.positions.length === 0 ? (
            <tr className={cn("h-16 border-b border-neutral-200 dark:border-neutral-800")}>
              <td colSpan={5} className={cn("px-4 sm:px-8 lg:px-16")}>Keine Positionen.</td>
            </tr>
          ) : null}
          {result.positions.map((position) => (
            <tr key={position.id} className={cn("border-b border-neutral-200 align-top dark:border-neutral-800")}>
              <td className={cn("py-2.5 pr-2 pl-4 sm:pl-8 lg:pl-16")}>
                <span className={cn("font-medium text-black dark:text-white")}>{position.name}</span>
                {position.text ? <span className={cn("mt-0.5 block whitespace-pre-line text-xs")}>{position.text}</span> : null}
              </td>
              <td className={cn("py-2.5 pr-2 text-right tabular-nums")}>{quantityFormat.format(position.quantity)}</td>
              <td className={cn("py-2.5 pr-2 text-right tabular-nums whitespace-nowrap")}>{formatMoney(position.unitNetCents, invoice.currency)}</td>
              <td className={cn("py-2.5 pr-2 text-right tabular-nums")}>{position.taxRate} %</td>
              <td className={cn("py-2.5 pr-4 text-right tabular-nums whitespace-nowrap text-black sm:pr-8 lg:pr-16 dark:text-white")}>{formatMoney(position.netCents, invoice.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const InvoicePositionsSkeleton = () => (
  <div aria-busy="true" aria-label="Positionen werden geladen" className={cn("border-t border-neutral-200 px-4 py-6 sm:px-8 lg:px-16 dark:border-neutral-800")}>
    <Skeleton className={cn("h-24 w-full")} />
  </div>
)
