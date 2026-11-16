import { cn } from "@lw/ui/lib/utils"

/** One key figure: label, value, optional detail line. */
export const Kpi = ({ label, value, detail, tone = "default" }: { label: string; value: string; detail?: React.ReactNode; tone?: "default" | "warning" }) => (
  <div className={cn("flex flex-col gap-1 px-4 py-6 sm:px-8 lg:px-0")}>
    <dt className={cn("text-sm")}>{label}</dt>
    <dd className={cn("font-medium text-2xl tabular-nums text-black dark:text-white", tone === "warning" && "text-amber-700 dark:text-amber-400")}>{value}</dd>
    {detail ? <dd className={cn("text-xs tabular-nums")}>{detail}</dd> : null}
  </div>
)
