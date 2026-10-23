'use client'

import { Button } from '@lw/ui/components/button'
import { authClient } from '@/lib/auth/auth-client'
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
