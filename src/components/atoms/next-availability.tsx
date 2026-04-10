'use client'

import { cn } from '@/lib/utils'
import { useEffect, useMemo, useState } from 'react'

type NextAvailabilityProps = {
  memberSlug: string
  locale: 'de' | 'en'
  className?: string
}

type NextAvailabilityApiResponse = {
  nextStart: string | null
  timezone: string | null
}

function getDateKey(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone }).format(date)
}

function getLocalizedWeekday(date: Date, locale: 'de' | 'en', timeZone: string): string {
  return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
    weekday: 'long',
    timeZone
  }).format(date)
}

function getAvailabilityLabel(nextStartIso: string, locale: 'de' | 'en', timeZone: string): string {
  const now = new Date()
  const next = new Date(nextStartIso)

  const nowKey = getDateKey(now, timeZone)
  const nextKey = getDateKey(next, timeZone)

  const nowLocalMidnight = new Date(`${nowKey}T00:00:00`)
  const nextLocalMidnight = new Date(`${nextKey}T00:00:00`)
  const dayDiff = Math.round(
    (nextLocalMidnight.getTime() - nowLocalMidnight.getTime()) / (24 * 60 * 60 * 1000)
  )

  if (dayDiff <= 1) {
    return locale === 'de' ? 'Morgen verfügbar' : 'Available tomorrow'
  }

  if (dayDiff === 2) {
    return locale === 'de' ? 'Übermorgen verfügbar' : 'Available in 2 days'
  }

  const weekday = getLocalizedWeekday(next, locale, timeZone)
  return locale === 'de' ? `Nächsten ${weekday} verfügbar` : `Available next ${weekday}`
}

export const NextAvailability = ({ memberSlug, locale, className }: NextAvailabilityProps) => {
  const [data, setData] = useState<NextAvailabilityApiResponse | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchNextAvailability = async () => {
      try {
        const params = new URLSearchParams({
          member: memberSlug,
          locale
        })
        const res = await fetch(`/api/availability/next?${params.toString()}`)
        if (!res.ok || cancelled) return
        const json = (await res.json()) as NextAvailabilityApiResponse
        if (!cancelled) {
          setData(json)
        }
      } finally {
        if (!cancelled) {
          setLoaded(true)
        }
      }
    }

    fetchNextAvailability()
    return () => {
      cancelled = true
    }
  }, [memberSlug, locale])

  const label = useMemo(() => {
    if (!data?.nextStart || !data.timezone) return null
    return getAvailabilityLabel(data.nextStart, locale, data.timezone)
  }, [data, locale])

  if (!loaded || !label) {
    return null
  }

  return (
    <div className={cn('flex items-center gap-1.5 text-sm ml-2', className)}>
      <span className="shrink-0 size-3 relative flex items-center justify-center">
        <span className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-400/20 rounded-full" />
        <span className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-400/20 rounded-full animate-ping" />
        <span className="size-1.5 shrink-0 bg-emerald-500 dark:bg-emerald-400 rounded-full" />
      </span>
      {label}
    </div>
  )
}
