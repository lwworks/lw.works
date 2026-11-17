import { formatDateTime } from "@/lib/format/format-date-time"
import { formatRelativeTime } from "@/lib/format/format-relative-time"
import { cn } from "@lw/ui/lib/utils"

/** „vor 9 Wochen“, with the exact date and time on hover. Server and client may differ by a minute, hence the warning opt-out. */
export const RelativeTime = ({ date, className }: { date: Date; className?: string }) => (
  <time dateTime={date.toISOString()} title={formatDateTime(date)} suppressHydrationWarning className={cn("text-neutral-500", className)}>
    {formatRelativeTime(date)}
  </time>
)
