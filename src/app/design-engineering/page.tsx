import { DesignEngineeringPage } from '@/components/pages/design-engineering'
import { baseUrl } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Design Engineering Studio — LW Works GmbH',
  description: 'Webentwicklung, Design Engineering und KI-Automatisierung. Maßgeschneiderte Lösungen für Ihr Unternehmen.',
  alternates: {
    canonical: `${baseUrl}/design-engineering`,
  },
  openGraph: {
    title: 'Design Engineering Studio — LW Works GmbH',
    description: 'Webentwicklung, Design Engineering und KI-Automatisierung. Maßgeschneiderte Lösungen für Ihr Unternehmen.',
    url: `${baseUrl}/design-engineering`,
    locale: 'de_DE',
  },
}

export default function DesignEngineering() {
  return <DesignEngineeringPage />
}
