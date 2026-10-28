'use client'

import { formatDate, formatShortDate } from '@/lib/format/format-date-time'
import { getIsoWeekRange } from '@/lib/iso-week/get-iso-week-range'
import { formatIsoWeek, shiftIsoWeek, type IsoWeek } from '@/lib/iso-week/iso-week'
import { Button } from '@lw/ui/components/button'
import { ChevronLeft, ChevronRight } from '@mynaui/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createContext, use, useOptimistic, useTransition, type ComponentProps, type ReactNode } from 'react'

type WeekNavigationState = {
  /** The week being shown, or being navigated to while `pending`. */
  week: IsoWeek
  pending: boolean
  goTo: (week: IsoWeek, href: string) => void
}

const WeekNavigationContext = createContext<WeekNavigationState | null>(null)

const useWeekNavigation = () => {
  const state = use(WeekNavigationContext)
  if (!state) throw new Error('useWeekNavigation must be used inside <WeekNavigationProvider>')
  return state
}

/**
 * Week links navigate inside a transition: the label switches to the target week right away and `WeekPending`
 * shows its fallback until the server has rendered that week.
 */
export const WeekNavigationProvider = ({ week, children }: { week: IsoWeek; children: ReactNode }) => {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [optimisticWeek, setOptimisticWeek] = useOptimistic(week)

  const goTo = (target: IsoWeek, href: string) =>
    startTransition(() => {
      setOptimisticWeek(target)
      router.push(href)
    })

  return <WeekNavigationContext value={{ week: optimisticWeek, pending, goTo }}>{children}</WeekNavigationContext>
}

/** Renders `fallback` instead of `children` while another week is loading. */
export const WeekPending = ({ fallback, children }: { fallback: ReactNode; children: ReactNode }) => {
  const { pending } = useWeekNavigation()
  return pending ? fallback : children
}

const WeekLink = ({ week, href, ...props }: { week: IsoWeek; href: string } & Omit<ComponentProps<typeof Link>, 'href'>) => {
  const { goTo } = useWeekNavigation()
  return (
    <Link
      href={href}
      onNavigate={(event) => {
        event.preventDefault()
        goTo(week, href)
      }}
      {...props}
    />
  )
}

const weekHref = (week: IsoWeek) => `/zeiterfassung?woche=${formatIsoWeek(week)}`

export const WeekNavigation = ({ currentWeek }: { currentWeek: IsoWeek }) => {
  const { week } = useWeekNavigation()
  const previous = shiftIsoWeek(week, -1)
  const next = shiftIsoWeek(week, 1)
  const range = getIsoWeekRange(week)

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon-sm" asChild>
        <WeekLink week={previous} href={weekHref(previous)} aria-label="Vorherige Woche">
          <ChevronLeft strokeWidth={1.5} />
        </WeekLink>
      </Button>
      <Button variant="outline" size="icon-sm" asChild>
        <WeekLink week={next} href={weekHref(next)} aria-label="Nächste Woche">
          <ChevronRight strokeWidth={1.5} />
        </WeekLink>
      </Button>
      <span className="text-sm font-medium text-black dark:text-white">
        KW {week.week} · {formatShortDate(range.start)}–{formatDate(new Date(range.end.getTime() - 1))}
      </span>
      {formatIsoWeek(week) === formatIsoWeek(currentWeek) ? null : (
        <Button variant="ghost" size="sm" asChild>
          <WeekLink week={currentWeek} href="/zeiterfassung">Heute</WeekLink>
        </Button>
      )}
    </div>
  )
}
