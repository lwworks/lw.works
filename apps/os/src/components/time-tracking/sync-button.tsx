'use client'

import { syncOwnCalendar } from '@/app/zeiterfassung/actions'
import { Button } from '@lw/ui/components/button'
import { toast } from '@lw/ui/components/sonner'
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
        const { status } = await syncOwnCalendar()
        if (status === 'locked') toast.error('Eine Synchronisierung läuft bereits. Bitte versuche es in ein paar Minuten erneut.')
        else if (status === 'error') toast.error('Die Synchronisierung ist fehlgeschlagen. Bitte versuche es später erneut.')
      })}
    >
      <Refresh data-icon="inline-start" strokeWidth={1.5} className={cn(pending && 'animate-spin')} />
      <span>{pending ? 'Synchronisiere …' : 'Jetzt synchronisieren'}</span>
    </Button>
  )
}
