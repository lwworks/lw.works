'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/os/auth-client'
import { useState } from 'react'

export const GoogleSignInButton = () => {
  const [pending, setPending] = useState(false)

  return (
    <Button
      className=""
      disabled={pending}
      onClick={async () => {
        setPending(true)
        await authClient.signIn.social({
          provider: 'google',
          callbackURL: '/os',
        })
      }}
    >
      <GoogleMark data-icon="inline-start" />
      Mit Google anmelden
    </Button>
  )
}

const GoogleMark = (props: React.ComponentProps<'svg'>) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3.01h3.88c2.27-2.09 3.55-5.17 3.55-8.87Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.86l-3.88-3.01c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11C3.25 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.32A7.2 7.2 0 0 1 4.89 12c0-.81.14-1.59.38-2.32V6.57H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.43l4-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.45-3.45C17.95 1.14 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.57l4 3.11C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  )
}
