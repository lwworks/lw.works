import { Badge } from "@lw/ui/components/badge"
import { cn } from "@lw/ui/lib/utils"
import Link from "next/link"

export const ProjectBadge = ({ projectKey, slug, title, className }: { projectKey: string; slug?: string; title?: string; className?: string }) => {
  const badge = (
    <Badge variant="outline" title={title} className={cn("font-mono tracking-wide text-black dark:text-white", className)}>
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
