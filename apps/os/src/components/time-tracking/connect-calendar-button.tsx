'use client'

import { connectGoogleCalendar } from '@/lib/auth/connect-google-calendar'
import { Button } from '@lw/ui/components/button'
import { toast } from '@lw/ui/components/sonner'
import { Calendar } from '@mynaui/icons-react'
import { useState } from 'react'

export const ConnectCalendarButton = ({ proxied }: { proxied: boolean }) => {
  const [pending, setPending] = useState(false)

  return (
    <Button
      size="sm"
      disabled={pending}
      onClick={async () => {
        setPending(true)
        const { error } = await connectGoogleCalendar({ callbackURL: '/zeiterfassung', proxied }).catch(() => ({ error: true }))
        if (!error) return
        setPending(false)
        toast.error('Google Kalender konnte nicht verbunden werden. Bitte versuche es erneut.')
      }}
    >
      <Calendar data-icon="inline-start" strokeWidth={1.5} />
      <span>{pending ? 'Verbinde …' : 'Google Kalender verbinden'}</span>
    </Button>
  )
}
