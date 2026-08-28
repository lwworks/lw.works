import { CheckConfirmationPage } from '@/components/pages/check/confirmation'
import type { Metadata } from 'next'
import { Suspense } from 'react'


export const metadata: Metadata = {
  title: 'Termin bestätigt',
  description: '',
}

export default async function Check() {
  return (
    <Suspense>
      <CheckConfirmationPage />
    </Suspense>
  )
}
