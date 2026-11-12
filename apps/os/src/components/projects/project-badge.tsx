import { CompanyIcon } from "@/components/atoms/company-icon"
import { Badge } from "@lw/ui/components/badge"
import { cn } from "@lw/ui/lib/utils"
import Link from "next/link"

/** Project key with the icon of the project's company. */
export const ProjectBadge = ({
  projectKey,
  companyId,
  logoKey,
  slug,
  title,
  className,
}: {
  projectKey: string
  companyId: string
  logoKey: string | null
  slug?: string
  title?: string
  className?: string
}) => {
  const badge = (
    <Badge variant="outline" title={title} className={cn("pl-1.5 font-mono tracking-wide text-black dark:text-white", className)}>
      <CompanyIcon companyId={companyId} logoKey={logoKey} size={12} className="rounded-[2px]" />
      {projectKey}
    </Badge>
  )
  if (!slug) return badge
  return (
    <Link href={`/projekte/${slug}`} className={cn("shrink-0 rounded-4xl")}>
      {badge}
    </Link>
  )
}
