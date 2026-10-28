'use client'

import { Button } from '@lw/ui/components/button'
import { Logout } from '@mynaui/icons-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const SignOutButton = () => {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  return (
    <Button
      variant="outline"
      size="icon-sm"
      disabled={pending}
      onClick={async () => {
        setPending(true)
        const { authClient } = await import('@/lib/auth/auth-client')
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push('/login')
              router.refresh()
            },
          },
        })
        setPending(false)
      }}
    >
      <Logout strokeWidth={1.5} />
    </Button>
  )
}
