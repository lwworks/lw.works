'use client'

import { syncOwnCalendar } from '@/app/zeiterfassung/actions'
import { formatDateKey } from '@/lib/format/format-date-key'
import { Button } from '@lw/ui/components/button'
import { Popover, PopoverContent, PopoverTrigger } from '@lw/ui/components/popover'
import { Skeleton } from '@lw/ui/components/skeleton'
import { toast } from '@lw/ui/components/sonner'
import { cn } from '@lw/ui/lib/utils'
import { Refresh } from '@mynaui/icons-react'
import dynamic from 'next/dynamic'
import { useState, useTransition } from 'react'
import type { DateRange } from 'react-day-picker'

// react-day-picker is the biggest client dependency on the page; load it with the popover, not the page.
const SyncRangeCalendar = dynamic(() => import('./sync-range-calendar').then((m) => m.SyncRangeCalendar), {
  loading: () => <Skeleton className="h-[258px] w-[212px]" />,
})
const preloadCalendar = () => {
  import('./sync-range-calendar').catch(() => {})
}

const lastSevenDays = (): DateRange => {
  const to = new Date()
  return { from: new Date(to.getFullYear(), to.getMonth(), to.getDate() - 6), to }
}

export const SyncButton = () => {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState<DateRange | undefined>(lastSevenDays)
  const [pending, startTransition] = useTransition()

  const sync = (from: Date, to: Date) => {
    setOpen(false)
    startTransition(async () => {
      const { status } = await syncOwnCalendar({ from: formatDateKey(from), to: formatDateKey(to) })
      if (status === 'locked') toast.error('Eine Synchronisierung läuft bereits. Bitte versuche es in ein paar Minuten erneut.')
      else if (status === 'error' || status === 'invalid_range') toast.error('Die Synchronisierung ist fehlgeschlagen. Bitte versuche es später erneut.')
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={pending} onPointerEnter={preloadCalendar} onFocus={preloadCalendar}>
          <Refresh strokeWidth={1.5} className={cn('size-4', pending && 'animate-spin')} />
          <span>Sync</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto flex flex-col gap-3">
        <SyncRangeCalendar range={range} onRangeChange={setRange} />
        <Button size="sm" disabled={!range?.from} onClick={() => range?.from && sync(range.from, range.to ?? range.from)}>
          Zeitraum synchronisieren
        </Button>
      </PopoverContent>
    </Popover>
  )
}
