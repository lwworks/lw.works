'use client'

import { useAvailability } from '@/lib/google-calendar/use-availability'
import { cn } from '@/lib/utils'

type NextAvailabilityProps = {
  bookingType: string
  className?: string
}

export const NextAvailability = ({ bookingType, className }: NextAvailabilityProps) => {
  const { availability } = useAvailability(bookingType)

  if (!availability) return null

  return (
    <div className={cn('flex items-center gap-1.5 text-sm', className)}>
      <span className="shrink-0 size-3.5 relative flex items-center justify-center">
        <span className="absolute inset-0 bg-lime/50  rounded-full" />
        <span className="absolute inset-0 bg-lime/75 rounded-full animate-ping" />
        <span className="size-2 shrink-0 bg-lime rounded-full border border-black/10" />
      </span>
      {availability}
    </div>
  )
}
