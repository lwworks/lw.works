'use client'

import { syncOwnCalendar } from '@/app/zeiterfassung/actions'
import { Button } from '@lw/ui/components/button'
import { toast } from '@lw/ui/components/sonner'
import { cn } from '@lw/ui/lib/utils'
import { Refresh } from '@mynaui/icons-react'
import { useTransition } from 'react'

const syncFailureMessage = (status: Awaited<ReturnType<typeof syncOwnCalendar>>['status']) => {
  if (status === 'locked') return 'Eine Synchronisierung läuft bereits. Bitte versuche es in ein paar Minuten erneut.'
  if (status === 'reauth_required' || status === 'missing_scope') return 'Google Kalender muss erneut verbunden werden.'
  return 'Die Synchronisierung ist fehlgeschlagen. Bitte versuche es später erneut.'
}

export const SyncButton = () => {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() => startTransition(async () => {
        const result = await syncOwnCalendar()
        if (result.status !== 'ok') toast.error(syncFailureMessage(result.status))
      })}
    >
      <Refresh data-icon="inline-start" strokeWidth={1.5} className={cn(pending && 'animate-spin')} />
      <span>{pending ? 'Synchronisiere …' : 'Jetzt synchronisieren'}</span>
    </Button>
  )
}
