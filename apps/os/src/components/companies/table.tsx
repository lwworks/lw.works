"use client"

import { CompanyIcon } from "@/components/atoms/company-icon"
import { CreateCompanyDialog } from "@/components/companies/company-form"
import { EmptyTableRow, SelectableTableHeader, SelectableTableRow, SelectionBar } from "@/components/molecules/selectable-table"
import { firstTextCell, lastTextCell, trailGutterCell } from "@/components/molecules/table-gutters"
import type { CompanyListItem } from "@/lib/db/companies/list-companies"
import { useRowSelection } from "@/lib/selection/use-row-selection"
import { Table, TableBody, TableCell, TableHead } from "@lw/ui/components/table"
import { cn } from "@lw/ui/lib/utils"
import Link from "next/link"
import { PageHeader } from "../molecules/page-header"

export const CompaniesTable = ({ companies }: { companies: CompanyListItem[] }) => {
  const selection = useRowSelection(companies.map((company) => company.id))
  const selectedCount = selection.selectedIds.length
  return (
    <section>
      <PageHeader title="Unternehmen" description="Firmen für das ganze Team. Sie werden nicht mit Google Kontakte abgeglichen.">
        <CreateCompanyDialog />
      </PageHeader>
      <Table className={cn("min-w-xl")}>
        <SelectableTableHeader selection={selection} label="Alle Unternehmen auswählen">
          <TableHead className={cn(firstTextCell)}>Name</TableHead>
          <TableHead>Ort</TableHead>
          <TableHead className={cn(lastTextCell)}>Website</TableHead>
          <TableHead className={cn(trailGutterCell)} />
        </SelectableTableHeader>
        <TableBody>
          {companies.length === 0 ? <EmptyTableRow columns={5}>Noch keine Unternehmen.</EmptyTableRow> : null}
          {companies.map((company) => (
            <SelectableTableRow key={company.id} selection={selection} id={company.id} label={`${company.name} auswählen`}>
              <TableCell className={cn(firstTextCell)}>
                <Link href={`/unternehmen/${company.id}`} className={cn("group inline-flex items-center gap-1.5 font-medium text-black dark:text-white")}>
                  <CompanyIcon companyId={company.id} logoKey={company.logoKey} />
                  <span className={cn("group-hover:underline")}>{company.name}</span>
                </Link>
              </TableCell>
              <TableCell>{company.cities}</TableCell>
              <TableCell className={cn(lastTextCell)}>
                {company.website ? (
                  <a href={company.website} className={cn("hover:underline")} rel="noreferrer" target="_blank">{company.website}</a>
                ) : null}
              </TableCell>
              <TableCell className={cn(trailGutterCell)} />
            </SelectableTableRow>
          ))}
        </TableBody>
      </Table>
      <SelectionBar selection={selection} label="Ausgewählte Unternehmen" count={selectedCount === 1 ? "1 Unternehmen" : `${selectedCount} Unternehmen`} />
    </section>
  )
}
