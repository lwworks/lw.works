import { CompanyIcon } from "@/components/atoms/company-icon"
import { cn } from "@lw/ui/lib/utils"
import Link from "next/link"

/** Linked company in a table cell: logo and name in a rounded pill. */
export const CompanyPill = ({ company, className }: { company: { id: string; name: string; logoKey: string | null }; className?: string }) => (
  <Link
    href={`/unternehmen/${company.id}`}
    className={cn(
      "inline-flex h-6 max-w-full items-center gap-1.5 rounded-full border pr-2 pl-1.5 hover:bg-neutral-100 hover:text-black dark:hover:bg-neutral-900 dark:hover:text-white",
      className,
    )}
  >
    <CompanyIcon companyId={company.id} logoKey={company.logoKey} />
    <span className={cn("truncate")}>{company.name}</span>
  </Link>
)
