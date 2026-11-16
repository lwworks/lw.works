import type { InvoiceStateTone } from "@/lib/finance/get-invoice-state"
import { Badge } from "@lw/ui/components/badge"
import { cn } from "@lw/ui/lib/utils"

const TONES: Record<InvoiceStateTone, string> = {
  neutral: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  muted: "border-neutral-200 bg-transparent text-neutral-500 dark:border-neutral-800",
  open: "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900",
  warning: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
}

export const InvoiceStateBadge = ({ state }: { state: { label: string; tone: InvoiceStateTone } }) => (
  <Badge variant="outline" className={cn("border-transparent", TONES[state.tone])}>{state.label}</Badge>
)
