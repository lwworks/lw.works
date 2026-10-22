'use client'

import { authClient } from '@/lib/auth-client'
import { GOOGLE_CALENDAR_SCOPE } from '@/lib/google-calendar/scope'
import { Button } from '@lw/ui/components/button'
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
        await authClient.linkSocial({
          provider: 'google',
          scopes: [GOOGLE_CALENDAR_SCOPE],
          callbackURL: '/zeiterfassung',
        })
      }}
    >
      <Calendar strokeWidth={1.5} />
      <span>Google Kalender verbinden</span>
    </Button>
  )
}
