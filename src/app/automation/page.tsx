import { AutomationPage } from '@/components/pages/automation'
import { baseUrl } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prozessautomatisierung mit KI — LW Works GmbH',
  description: 'Webentwicklung, Design Engineering und KI-Automatisierung. Maßgeschneiderte Lösungen für Ihr Unternehmen.',
  alternates: {
    canonical: `${baseUrl}/automation`,
  },
  openGraph: {
    title: 'Prozessautomatisierung mit KI — LW Works GmbH',
    description: 'Webentwicklung, Design Engineering und KI-Automatisierung. Maßgeschneiderte Lösungen für Ihr Unternehmen.',
    url: `${baseUrl}/automation`,
    locale: 'de_DE',
  },
}

export default function Automation() {
  return <AutomationPage />
}
