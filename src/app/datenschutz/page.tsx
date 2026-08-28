import { PrivacyPage } from '@/components/pages/privacy'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: '',
}

export default function Privacy() {
  return <PrivacyPage />
}
