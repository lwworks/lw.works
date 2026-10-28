'use client'

import { signOut } from '@/lib/auth/sign-out'
import { Button } from '@lw/ui/components/button'
import { toast } from '@lw/ui/components/sonner'
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
        if (await signOut()) {
          router.push('/login')
          router.refresh()
        } else {
          toast.error('Abmelden ist fehlgeschlagen. Bitte versuche es erneut.')
        }
        setPending(false)
      }}
    >
      <Logout strokeWidth={1.5} />
    </Button>
  )
}
