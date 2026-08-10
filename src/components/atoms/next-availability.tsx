'use client'

import { cn } from '@/lib/utils'
import { useEffect, useMemo, useState } from 'react'

type NextAvailabilityProps = {
  memberSlug: string
  className?: string
}

type NextAvailabilityApiResponse = {
  nextStart: string | null
  timezone: string | null
}

function getDateKey(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone }).format(date)
}

function getLocalizedWeekday(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    timeZone,
  }).format(date)
}

function getAvailabilityLabel(nextStartIso: string, timeZone: string): string {
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
    return 'Morgen verfügbar'
  }

  if (dayDiff === 2) {
    return 'Übermorgen verfügbar'
  }

  const weekday = getLocalizedWeekday(next, timeZone)
  return `Nächsten ${weekday} verfügbar`
}

export const NextAvailability = ({ memberSlug, className }: NextAvailabilityProps) => {
  const [data, setData] = useState<NextAvailabilityApiResponse | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchNextAvailability = async () => {
      try {
        const params = new URLSearchParams({ member: memberSlug })
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
  }, [memberSlug])

  const label = useMemo(() => {
    if (!data?.nextStart || !data.timezone) return null
    return getAvailabilityLabel(data.nextStart, data.timezone)
  }, [data])

  if (!loaded || !label) {
    return null
  }

  return (
    <div className={cn('flex items-center gap-1.5 text-sm', className)}>
      <span className="shrink-0 size-3 relative flex items-center justify-center">
        <span className="absolute inset-0 bg-lime/25  rounded-full" />
        <span className="absolute inset-0 bg-lime/25 rounded-full animate-ping" />
        <span className="size-1.5 shrink-0 bg-lime-dark rounded-full" />
      </span>
      {label}
    </div>
  )
}
