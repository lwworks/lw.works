import { CompanyIcon } from "@/components/atoms/company-icon"
import { InvoiceStateBadge } from "@/components/finance/invoice-state-badge"
import type { InvoiceListItem } from "@/lib/db/invoices/list-invoices"
import { getInvoiceState } from "@/lib/finance/get-invoice-state"
import { formatDateKeyDe } from "@/lib/finance/format-date-key-de"
import { formatMoney } from "@/lib/format/format-money"
import { Button } from "@lw/ui/components/button"
import { cn } from "@lw/ui/lib/utils"
import { FileText } from "@mynaui/icons-react"
import Link from "next/link"

/**
 * Invoices, newest first. Amounts are net EUR; foreign-currency invoices show the original amount below.
 * `hideCustomer` for lists that already belong to one customer (the company page).
 */
export const InvoicesTable = ({ invoices, today, hideCustomer = false, empty }: { invoices: InvoiceListItem[]; today: string; hideCustomer?: boolean; empty: string }) => {
  const columns = hideCustomer ? 6 : 7
  return (
    <div className={cn("overflow-x-auto")}>
      <table className={cn("w-full min-w-2xl text-sm whitespace-nowrap")}>
        <thead>
          <tr className={cn("h-10 border-y border-neutral-200 dark:border-neutral-800")}>
            <td className={cn("pr-2 pl-4 sm:pl-8 lg:pl-16")}>Nummer</td>
            {hideCustomer ? null : <td className={cn("pr-2")}>Kunde</td>}
            <td className={cn("pr-2")}>Betreff</td>
            <td className={cn("pr-2")}>Datum</td>
            <td className={cn("pr-2")}>Status</td>
            <td className={cn("pr-2 text-right")}>Netto</td>
            <td className={cn("w-12 pr-4 sm:pr-8 lg:pr-16")}><span className={cn("sr-only")}>PDF</span></td>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr className={cn("h-16 border-b border-neutral-200 dark:border-neutral-800")}>
              <td colSpan={columns} className={cn("px-4 sm:px-8 lg:px-16")}>{empty}</td>
            </tr>
          ) : null}
          {invoices.map((invoice) => {
            const state = getInvoiceState(invoice, today)
            const isDraft = invoice.status === "draft"
            return (
              <tr key={invoice.id} className={cn("h-10 border-b border-neutral-200 dark:border-neutral-800")}>
                <td className={cn("pr-2 pl-4 sm:pl-8 lg:pl-16")}>
                  <Link href={`/finanzen/rechnungen/${invoice.id}`} className={cn("group font-medium tabular-nums text-black dark:text-white", isDraft && "text-neutral-500 dark:text-neutral-500")}>
                    <span className={cn("group-hover:underline")}>{invoice.number ?? "Entwurf"}</span>
                  </Link>
                </td>
                {hideCustomer ? null : (
                  <td className={cn("max-w-48 pr-2")}>
                    {invoice.companyId ? (
                      <Link
                        href={`/unternehmen/${invoice.companyId}`}
                        className={cn(
                          "inline-flex h-6 max-w-full items-center gap-1.5 rounded-full border pr-2 pl-1.5 hover:bg-neutral-100 hover:text-black dark:hover:bg-neutral-900 dark:hover:text-white",
                        )}
                      >
                        <CompanyIcon companyId={invoice.companyId} logoKey={invoice.companyLogoKey} />
                        <span className={cn("truncate")}>{invoice.companyName}</span>
                      </Link>
                    ) : (
                      <span className={cn("block truncate")}>{invoice.contactName}</span>
                    )}
                  </td>
                )}
                <td className={cn("w-full max-w-0 pr-2")}>
                  <span className={cn("block truncate")}>{invoice.subject}</span>
                </td>
                <td className={cn("pr-2 tabular-nums")}>{formatDateKeyDe(invoice.invoiceDate)}</td>
                <td className={cn("pr-2")}>
                  <InvoiceStateBadge state={state} />
                </td>
                <td className={cn("pr-2 text-right tabular-nums text-black dark:text-white")}>
                  {formatMoney(invoice.netEurCents)}
                  {invoice.currency !== "EUR" ? <span className={cn("block text-xs text-neutral-500")}>{formatMoney(invoice.netCents, invoice.currency)}</span> : null}
                </td>
                <td className={cn("pr-4 sm:pr-8 lg:pr-16")}>
                  <Button variant="ghost" size="icon-xs" asChild>
                    <a href={`/finanzen/rechnungen/${invoice.id}/pdf`} target="_blank" rel="noreferrer" aria-label={`PDF von ${invoice.number ?? "Entwurf"} öffnen`}>
                      <FileText strokeWidth={1.5} />
                    </a>
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
