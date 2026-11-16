"use client"

import { buildInvoicesHref } from "@/lib/finance/build-invoices-href"
import type { RevenueChartRow } from "@/lib/finance/build-revenue-chart-data"
import { formatMonth } from "@/lib/finance/format-month"
import { formatMoney } from "@/lib/format/format-money"
import { ChartContainer, ChartTooltip, type ChartConfig } from "@lw/ui/components/chart"
import { cn } from "@lw/ui/lib/utils"
import { useRouter } from "next/navigation"
import { Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, XAxis, YAxis } from "recharts"

const config = {
  netEurCents: { label: "Umsatz netto", theme: { light: "var(--color-neutral-900)", dark: "var(--color-neutral-100)" } },
  comparisonNetEurCents: { label: "Vorjahr", theme: { light: "var(--color-neutral-400)", dark: "var(--color-neutral-500)" } },
} satisfies ChartConfig

/**
 * Net revenue per month as bars, optionally the same months a year earlier as a dashed line. A bar opens the
 * invoices of its month. Values stay cents; only labels divide.
 */
export const RevenueChart = ({ data, showComparison }: { data: RevenueChartRow[]; showComparison: boolean }) => {
  const router = useRouter()
  const manyMonths = data.length > 24
  return (
    <div>
      <ChartContainer config={config} className={cn("aspect-auto h-72 w-full")}>
        <ComposedChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }} barCategoryGap={manyMonths ? 1 : "20%"} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={16}
            tickFormatter={(month: string) => (manyMonths ? month.slice(0, 4) : formatMonth(month, { short: true }))}
          />
          <YAxis width={72} tickLine={false} axisLine={false} tickFormatter={(cents: number) => formatMoney(cents, "EUR", { compact: true })} />
          <ReferenceLine y={0} stroke="var(--border)" />
          <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<RevenueTooltip showComparison={showComparison} />} />
          <Bar
            dataKey="netEurCents"
            fill="var(--color-netEurCents)"
            radius={manyMonths ? 2 : 4}
            className={cn("cursor-pointer")}
            onClick={(row: { payload?: RevenueChartRow }) => {
              if (row.payload) router.push(buildInvoicesHref({ view: "all", month: row.payload.month }))
            }}
          />
          {showComparison ? (
            <Line
              dataKey="comparisonNetEurCents"
              type="monotone"
              stroke="var(--color-comparisonNetEurCents)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 4 }}
            />
          ) : null}
        </ComposedChart>
      </ChartContainer>
      {showComparison ? (
        <div className={cn("mt-3 flex items-center justify-center gap-6 text-xs")}>
          <span className={cn("flex items-center gap-2")}>
            <span aria-hidden className={cn("size-2.5 rounded-[2px] bg-neutral-900 dark:bg-neutral-100")} />
            Umsatz netto
          </span>
          <span className={cn("flex items-center gap-2")}>
            <span aria-hidden className={cn("w-4 border-t-2 border-dashed border-neutral-400 dark:border-neutral-500")} />
            Vorjahr
          </span>
        </div>
      ) : null}
    </div>
  )
}

const RevenueTooltip = ({ active, payload, showComparison }: { active?: boolean; payload?: { payload: RevenueChartRow }[]; showComparison: boolean }) => {
  const row = payload?.[0]?.payload
  if (!active || !row) return null
  return (
    <div className={cn("grid min-w-44 gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl")}>
      <div className={cn("font-medium text-foreground")}>{formatMonth(row.month)}</div>
      <div className={cn("flex justify-between gap-4")}>
        <span>Umsatz netto</span>
        <span className={cn("font-mono font-medium text-foreground tabular-nums")}>{formatMoney(row.netEurCents)}</span>
      </div>
      <div className={cn("flex justify-between gap-4")}>
        <span>Rechnungen</span>
        <span className={cn("font-mono text-foreground tabular-nums")}>{row.count}</span>
      </div>
      {showComparison && row.comparisonMonth ? (
        <div className={cn("flex justify-between gap-4")}>
          <span>{formatMonth(row.comparisonMonth)}</span>
          <span className={cn("font-mono text-foreground tabular-nums")}>{formatMoney(row.comparisonNetEurCents ?? 0)}</span>
        </div>
      ) : null}
    </div>
  )
}
