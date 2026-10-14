import { PrivacyPage } from '@/components/pages/privacy'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Datenschutzerklärung der LW Works GmbH — Informationen zur Verarbeitung personenbezogener Daten auf lw.works nach DSGVO.',
  alternates: {
    canonical: '/datenschutz',
  },
}

export default function Privacy() {
  return <PrivacyPage />
}
