"use client"

import { CompanyPill } from "@/components/atoms/company-pill"
import { InvoiceStateBadge } from "@/components/finance/invoice-state-badge"
import { EmptyTableRow, SelectableTableHeader, SelectableTableRow, SelectionBar } from "@/components/molecules/selectable-table"
import { firstTextCell, lastTextCell, trailGutterCell, trailGutterInner } from "@/components/molecules/table-gutters"
import type { InvoiceListItem } from "@/lib/db/invoices/list-invoices"
import { formatDateKeyDe } from "@/lib/finance/format-date-key-de"
import { getInvoiceState } from "@/lib/finance/get-invoice-state"
import { formatMoney } from "@/lib/format/format-money"
import { useRowSelection } from "@/lib/selection/use-row-selection"
import { Button } from "@lw/ui/components/button"
import { Table, TableBody, TableCell, TableHead } from "@lw/ui/components/table"
import { cn } from "@lw/ui/lib/utils"
import { FileText } from "@mynaui/icons-react"
import Link from "next/link"

/**
 * Invoices, newest first. Amounts are net EUR; foreign-currency invoices show the original amount below.
 * `hideCustomer` for lists that already belong to one customer (the company page).
 */
export const InvoicesTable = ({ invoices, today, hideCustomer = false, empty }: { invoices: InvoiceListItem[]; today: string; hideCustomer?: boolean; empty: string }) => {
  const selection = useRowSelection(invoices.map((invoice) => invoice.id))
  const selectedNetEurCents = invoices.filter((invoice) => selection.isSelected(invoice.id)).reduce((sum, invoice) => sum + invoice.netEurCents, 0)
  const count = selection.selectedIds.length

  return (
    <>
      <Table className={cn("min-w-2xl")}>
        <SelectableTableHeader selection={selection} label="Alle Rechnungen auswählen">
          <TableHead className={cn(firstTextCell)}>Nummer</TableHead>
          {hideCustomer ? null : <TableHead>Kunde</TableHead>}
          <TableHead>Betreff</TableHead>
          <TableHead>Datum</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className={cn("text-right", lastTextCell)}>Netto</TableHead>
          <TableHead className={cn(trailGutterCell)}><span className={cn("sr-only")}>PDF</span></TableHead>
        </SelectableTableHeader>
        <TableBody>
          {invoices.length === 0 ? <EmptyTableRow columns={hideCustomer ? 7 : 8}>{empty}</EmptyTableRow> : null}
          {invoices.map((invoice) => {
            const state = getInvoiceState(invoice, today)
            const number = invoice.number ?? "Entwurf"
            return (
              <SelectableTableRow key={invoice.id} selection={selection} id={invoice.id} label={`${number} auswählen`}>
                <TableCell className={cn(firstTextCell)}>
                  <Link
                    href={`/finanzen/rechnungen/${invoice.id}`}
                    className={cn("group font-medium tabular-nums text-black dark:text-white", invoice.status === "draft" && "text-neutral-500 dark:text-neutral-500")}
                  >
                    <span className={cn("group-hover:underline")}>{number}</span>
                  </Link>
                </TableCell>
                {hideCustomer ? null : (
                  <TableCell className={cn("max-w-48")}>
                    {invoice.companyId ? (
                      <CompanyPill company={{ id: invoice.companyId, name: invoice.companyName ?? "", logoKey: invoice.companyLogoKey }} />
                    ) : (
                      <span className={cn("block truncate")}>{invoice.contactName}</span>
                    )}
                  </TableCell>
                )}
                <TableCell className={cn("w-full max-w-0")}>
                  <span className={cn("block truncate")}>{invoice.subject}</span>
                </TableCell>
                <TableCell className={cn("tabular-nums")}>{formatDateKeyDe(invoice.invoiceDate)}</TableCell>
                <TableCell>
                  <InvoiceStateBadge state={state} />
                </TableCell>
                <TableCell className={cn("text-right tabular-nums text-black dark:text-white", lastTextCell)}>
                  {formatMoney(invoice.netEurCents)}
                  {invoice.currency !== "EUR" ? <span className={cn("block text-xs text-neutral-500")}>{formatMoney(invoice.netCents, invoice.currency)}</span> : null}
                </TableCell>
                <TableCell className={cn(trailGutterCell)}>
                  <div className={cn(trailGutterInner)}>
                    <Button variant="ghost" size="icon-xs" asChild>
                      <a href={`/finanzen/rechnungen/${invoice.id}/pdf`} target="_blank" rel="noreferrer" aria-label={`PDF von ${number} öffnen`}>
                        <FileText strokeWidth={1.5} />
                      </a>
                    </Button>
                  </div>
                </TableCell>
              </SelectableTableRow>
            )
          })}
        </TableBody>
      </Table>
      <SelectionBar
        selection={selection}
        label="Ausgewählte Rechnungen"
        count={count === 1 ? "1 Rechnung" : `${count} Rechnungen`}
        detail={`${formatMoney(selectedNetEurCents)} netto`}
      />
    </>
  )
}
