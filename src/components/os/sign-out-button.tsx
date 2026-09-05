'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/os/auth-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const SignOutButton = () => {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={async () => {
        setPending(true)
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push('/os/login')
              router.refresh()
            },
          },
        })
        setPending(false)
      }}
    >
      Abmelden
    </Button>
  )
}
