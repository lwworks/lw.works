'use client'

import { authClient } from '@/lib/auth-client'
import { GOOGLE_CALENDAR_SCOPE } from '@/lib/google-calendar/scope'
import { Button } from '@lw/ui/components/button'
import { toast } from '@lw/ui/components/sonner'
import { Calendar } from '@mynaui/icons-react'
import { useState } from 'react'

export const ConnectCalendarButton = () => {
  const [pending, setPending] = useState(false)

  return (
    <Button
      size="sm"
      disabled={pending}
      onClick={async () => {
        setPending(true)
        const { error } = await authClient
          .linkSocial({ provider: 'google', scopes: [GOOGLE_CALENDAR_SCOPE], callbackURL: '/zeiterfassung' })
          .catch(() => ({ error: true }))
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
