import { CheckPage } from '@/components/pages/check'
import { baseUrl } from '@/lib/site'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Kostenloser Prozess-Check — LW Works GmbH',
  description: 'Webentwicklung, Design Engineering und KI-Automatisierung. Maßgeschneiderte Lösungen für Ihr Unternehmen.',
  alternates: {
    canonical: `${baseUrl}/design-engineering`,
  },
  openGraph: {
    title: 'Kostenloser Prozess-Check — LW Works GmbH',
    description: 'Webentwicklung, Design Engineering und KI-Automatisierung. Maßgeschneiderte Lösungen für Ihr Unternehmen.',
    url: `${baseUrl}/design-engineering`,
    locale: 'de_DE',
  },
}

export default async function Check() {
  return <CheckPage />
}
