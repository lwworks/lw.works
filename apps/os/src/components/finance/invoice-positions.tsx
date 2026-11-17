import { InvoicePositionsTable } from "@/components/finance/invoice-positions-table"
import type { InvoiceDetail } from "@/lib/db/invoices/get-invoice"
import { loadInvoicePositions } from "@/lib/finance/load-invoice-positions"
import { Skeleton } from "@lw/ui/components/skeleton"
import { cn } from "@lw/ui/lib/utils"

/** Line items, loaded live from SevDesk while the rest of the page is already shown. */
export const InvoicePositions = async ({ invoice }: { invoice: InvoiceDetail }) => {
  const result = await loadInvoicePositions(invoice)
  if (!result.ok) return <p className={cn("px-4 py-6 text-sm sm:px-8 lg:px-16")}>Positionen konnten nicht geladen werden: {result.message}</p>
  return <InvoicePositionsTable positions={result.positions} currency={invoice.currency} />
}

export const InvoicePositionsSkeleton = () => (
  <div aria-busy="true" aria-label="Positionen werden geladen" className={cn("border-t border-neutral-200 px-4 py-6 sm:px-8 lg:px-16 dark:border-neutral-800")}>
    <Skeleton className={cn("h-24 w-full")} />
  </div>
)
