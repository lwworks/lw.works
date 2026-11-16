import { SevdeskSyncButton } from "@/components/finance/sevdesk-sync-button"
import { formatDateTime } from "@/lib/format/format-date-time"
import { cn } from "@lw/ui/lib/utils"

/** Last sync time (and error) next to the manual sync button. */
export const SyncStatus = ({ state }: { state: { lastSyncedAt: Date | null; lastError: string | null } | null }) => (
  <div className={cn("flex flex-wrap items-center gap-3")}>
    <span className={cn("text-xs")}>{state?.lastSyncedAt ? `Stand: ${formatDateTime(state.lastSyncedAt)}` : "Noch nie synchronisiert"}</span>
    <SevdeskSyncButton />
  </div>
)
