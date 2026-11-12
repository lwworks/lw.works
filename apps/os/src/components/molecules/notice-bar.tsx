import { cn } from "@lw/ui/lib/utils"

/**
 * Full-width notice between page sections, separated by a horizontal border instead of drawn as a card.
 * Only the top border is drawn; add `border-b` when the next element has no border of its own.
 */
export const NoticeBar = ({
  tone = "default",
  icon,
  action,
  children,
  className,
}: {
  tone?: "default" | "warning"
  icon?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) => (
  <div
    className={cn(
      "flex flex-col gap-3 border-t border-neutral-200 px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-16 dark:border-neutral-800",
      tone === "warning" && "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
      className,
    )}
  >
    <div className={cn("flex items-start gap-2")}>
      {icon}
      <p>{children}</p>
    </div>
    {action ? <div className={cn("shrink-0")}>{action}</div> : null}
  </div>
)
