import { PrivacyPage } from '@/components/pages/privacy'
import { baseUrl } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung — LW Works GmbH',
  description: 'Professionelle Webentwicklung & Design Engineering für Unternehmen. Custom Next.js, API-Integrationen und KI-gestützte Automatisierung.',
  alternates: {
    canonical: `${baseUrl}/privacy`,
  },
  openGraph: {
    title: 'Datenschutzerklärung — LW Works GmbH',
    description: 'Professionelle Webentwicklung & Design Engineering für Unternehmen. Custom Next.js, API-Integrationen und KI-gestützte Automatisierung.',
    url: `${baseUrl}/privacy`,
    locale: 'de_DE',
  },
}

export default function Privacy() {
  return <PrivacyPage />
}
