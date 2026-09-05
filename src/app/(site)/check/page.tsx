import { CheckPage } from '@/components/pages/check'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Kostenloser Prozess-Check',
  description: 'Kostenloser Prozess-Check der LW Works GmbH — wir analysieren Deine Abläufe und zeigen konkrete Automatisierungs- und KI-Potenziale auf.',
  alternates: {
    canonical: '/check',
  },
}

export default async function Check() {
  return <CheckPage />
}
