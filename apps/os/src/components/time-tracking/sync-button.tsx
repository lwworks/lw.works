'use client'

import { syncOwnCalendar } from '@/app/zeiterfassung/actions'
import { Button } from '@lw/ui/components/button'
import { cn } from '@lw/ui/lib/utils'
import { Refresh } from '@mynaui/icons-react'
import { useTransition } from 'react'

export const SyncButton = () => {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() => startTransition(async () => {
        await syncOwnCalendar()
      })}
    >
      <Refresh strokeWidth={1.5} className={cn(pending && 'animate-spin')} />
      <span>{pending ? 'Synchronisiere …' : 'Jetzt synchronisieren'}</span>
    </Button>
  )
}
