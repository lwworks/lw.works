"use client"

import { TabButton, TabLink, TabNav } from "@/components/molecules/tabs"
import { buildRevenueRangeHref } from "@/lib/finance/build-revenue-range-href"
import { formatMonth } from "@/lib/finance/format-month"
import type { RevenuePreset, RevenueRange } from "@/lib/finance/revenue-range"
import { Button } from "@lw/ui/components/button"
import { Label } from "@lw/ui/components/label"
import { Popover, PopoverContent, PopoverTrigger } from "@lw/ui/components/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lw/ui/components/select"
import { Switch } from "@lw/ui/components/switch"
import { cn } from "@lw/ui/lib/utils"
import { useRouter } from "next/navigation"
import { useState } from "react"

const PRESETS: { preset: Exclude<RevenuePreset, "frei">; label: string }[] = [
  { preset: "12m", label: "12 Monate" },
  { preset: "jahr", label: "Dieses Jahr" },
  { preset: "vorjahr", label: "Letztes Jahr" },
  { preset: "alles", label: "Alles" },
]

/**
 * Range tabs, a custom month range and the comparison switch. Everything lives in the URL.
 * `months` are the selectable `YYYY-MM`, oldest first; `canCompare` is false for ranges over 12 months.
 */
export const RangeControls = ({ range, compare, canCompare, months }: { range: RevenueRange; compare: boolean; canCompare: boolean; months: string[] }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [from, setFrom] = useState(range.from)
  const [to, setTo] = useState(range.to)
  const options = months.toReversed()

  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-6 gap-y-3 text-sm")}>
      <TabNav aria-label="Zeitraum">
        {PRESETS.map(({ preset, label }) => (
          <TabLink key={preset} href={buildRevenueRangeHref({ preset }, compare)} active={range.preset === preset}>
            {label}
          </TabLink>
        ))}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <TabButton active={range.preset === "frei"}>
              {range.preset === "frei" ? `${formatMonth(range.from, { short: true })} – ${formatMonth(range.to, { short: true })}` : "Benutzerdefiniert"}
            </TabButton>
          </PopoverTrigger>
          <PopoverContent align="start" className={cn("flex w-72 flex-col gap-3")}>
            <MonthSelect id="range-from" label="Von" value={from} onChange={setFrom} options={options} />
            <MonthSelect id="range-to" label="Bis" value={to} onChange={setTo} options={options} />
            <Button
              onClick={() => {
                setOpen(false)
                router.push(buildRevenueRangeHref({ preset: "frei", from, to }, compare), { scroll: false })
              }}
            >
              Anzeigen
            </Button>
          </PopoverContent>
        </Popover>
      </TabNav>
      {canCompare ? (
        <div className={cn("flex items-center gap-2 pb-2.5")}>
          <Switch id="compare" checked={compare} onCheckedChange={(checked) => router.push(buildRevenueRangeHref(range, checked), { scroll: false })} />
          <Label htmlFor="compare" className={cn("font-normal")}>Vorjahr vergleichen</Label>
        </div>
      ) : null}
    </div>
  )
}

const MonthSelect = ({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (value: string) => void; options: string[] }) => (
  <div className={cn("flex flex-col gap-1.5")}>
    <Label htmlFor={id}>{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className={cn("w-full")}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(options.includes(value) ? options : [value, ...options]).map((month) => (
          <SelectItem key={month} value={month}>{formatMonth(month)}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)
