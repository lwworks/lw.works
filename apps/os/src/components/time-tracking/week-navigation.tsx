'use client'

import { formatIsoWeekLabel } from '@/lib/iso-week/format-iso-week-label'
import { isAfterIsoWeek } from '@/lib/iso-week/is-after-iso-week'
import { isSameIsoWeek } from '@/lib/iso-week/is-same-iso-week'
import { formatIsoWeek, shiftIsoWeek, type IsoWeek } from '@/lib/iso-week/iso-week'
import { Button } from '@lw/ui/components/button'
import { ChevronLeft, ChevronRight } from '@mynaui/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createContext, use, useOptimistic, useTransition, type ComponentProps, type ReactNode } from 'react'

type WeekNavigationState = {
  /** The week being shown, or being navigated to while `pending`. */
  week: IsoWeek
  currentWeek: IsoWeek
  pending: boolean
  hrefFor: (week: IsoWeek) => string
  goTo: (week: IsoWeek) => void
}

const WeekNavigationContext = createContext<WeekNavigationState | null>(null)

export const useWeekNavigation = () => {
  const state = use(WeekNavigationContext)
  if (!state) throw new Error('useWeekNavigation must be used inside <WeekNavigationProvider>')
  return state
}

/**
 * Week links navigate inside a transition: the label switches to the target week right away and `WeekPending`
 * shows its fallback until the server has rendered that week.
 */
export const WeekNavigationProvider = ({ week, currentWeek, children }: { week: IsoWeek; currentWeek: IsoWeek; children: ReactNode }) => {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [optimisticWeek, setOptimisticWeek] = useOptimistic(week)

  const hrefFor = (target: IsoWeek) =>
    isSameIsoWeek(target, currentWeek) ? '/zeiterfassung' : `/zeiterfassung?woche=${formatIsoWeek(target)}`

  const goTo = (target: IsoWeek) =>
    startTransition(() => {
      setOptimisticWeek(target)
      router.push(hrefFor(target))
    })

  return (
    <WeekNavigationContext value={{ week: optimisticWeek, currentWeek, pending, hrefFor, goTo }}>
      {children}
    </WeekNavigationContext>
  )
}

/** Renders `fallback` instead of `children` while another week is loading. */
export const WeekPending = ({ fallback, children }: { fallback: ReactNode; children: ReactNode }) => {
  const { pending } = useWeekNavigation()
  return pending ? fallback : children
}

export const WeekLink = ({ week, ...props }: { week: IsoWeek } & Omit<ComponentProps<typeof Link>, 'href' | 'onNavigate'>) => {
  const { hrefFor, goTo, week: shownWeek } = useWeekNavigation()
  return (
    <Link
      {...props}
      href={hrefFor(week)}
      onNavigate={(event) => {
        event.preventDefault()
        if (!isSameIsoWeek(week, shownWeek)) goTo(week)
      }}
    />
  )
}

export const WeekNavigation = () => {
  const { week, currentWeek } = useWeekNavigation()

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon-sm" asChild>
        <WeekLink week={shiftIsoWeek(week, -1)} aria-label="Vorherige Woche">
          <ChevronLeft strokeWidth={1.5} />
        </WeekLink>
      </Button>
      {isAfterIsoWeek(currentWeek, week) ? (
        <Button variant="outline" size="icon-sm" asChild>
          <WeekLink week={shiftIsoWeek(week, 1)} aria-label="Nächste Woche">
            <ChevronRight strokeWidth={1.5} />
          </WeekLink>
        </Button>
      ) : (
        <Button variant="outline" size="icon-sm" disabled aria-label="Nächste Woche">
          <ChevronRight strokeWidth={1.5} />
        </Button>
      )}
      <span className="text-sm font-medium text-black dark:text-white">{formatIsoWeekLabel(week)}</span>
      {isSameIsoWeek(week, currentWeek) ? null : (
        <Button variant="ghost" size="sm" asChild>
          <WeekLink week={currentWeek}>Heute</WeekLink>
        </Button>
      )}
    </div>
  )
}
