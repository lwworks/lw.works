import { BniConfirmationPage } from '@/components/pages/bni/confirmation'
import { baseUrl } from '@/lib/site'
import type { Metadata } from 'next'
import { Suspense } from 'react'


export const metadata: Metadata = {
  title: 'Termin bestätigt — LW Works GmbH',
  description: 'Webentwicklung, Design Engineering und KI-Automatisierung. Maßgeschneiderte Lösungen für Ihr Unternehmen.',
  alternates: {
    canonical: `${baseUrl}/check/bestaetigung`,
  },
  openGraph: {
    title: 'Termin bestätigt — LW Works GmbH',
    description: 'Webentwicklung, Design Engineering und KI-Automatisierung. Maßgeschneiderte Lösungen für Ihr Unternehmen.',
    url: `${baseUrl}/check/bestaetigung`,
    locale: 'de_DE',
  },
}

export default async function Check() {
  return (
    <Suspense>
      <BniConfirmationPage />
    </Suspense>
  )
}
