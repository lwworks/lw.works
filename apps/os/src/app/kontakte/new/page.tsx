import { NewContactPage } from '@/components/pages/new-contact'
import { requireUserId } from '@/lib/auth/require-user-id'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = { title: 'Neuer Kontakt' }

const RequireSession = async () => {
  await requireUserId()
  return null
}

export default function Page() {
  return (
    <>
      <Suspense fallback={null}>
        <RequireSession />
      </Suspense>
      <NewContactPage />
    </>
  )
}
