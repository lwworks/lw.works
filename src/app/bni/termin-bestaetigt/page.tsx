import { BniConfirmationPage } from '@/components/pages/bni/confirmation'
import type { Metadata } from 'next'
import { Suspense } from 'react'


export const metadata: Metadata = {
  title: 'Termin bestätigt',
  description: '',
}

export default async function Check() {
  return (
    <Suspense>
      <BniConfirmationPage />
    </Suspense>
  )
}
