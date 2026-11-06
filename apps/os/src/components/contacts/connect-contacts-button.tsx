'use client'

import { connectGoogleContacts } from '@/lib/auth/connect-google-contacts'
import { Button } from '@lw/ui/components/button'
import { toast } from '@lw/ui/components/sonner'
import { User } from '@mynaui/icons-react'
import { useState } from 'react'

export const ConnectContactsButton = ({ proxied }: { proxied: boolean }) => {
  const [pending, setPending] = useState(false)

  return (
    <Button
      size="sm"
      disabled={pending}
      onClick={async () => {
        setPending(true)
        const { error } = await connectGoogleContacts({ callbackURL: '/kontakte', proxied }).catch(() => ({ error: true }))
        if (!error) return
        setPending(false)
        toast.error('Google Kontakte konnte nicht verbunden werden. Bitte versuche es erneut.')
      }}
    >
      <User data-icon="inline-start" strokeWidth={1.5} />
      <span>{pending ? 'Verbinde …' : 'Google Kontakte verbinden'}</span>
    </Button>
  )
}
