import { ContactPage } from '@/components/pages/contact'
import { baseUrl } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt — LW Works GmbH',
  description: 'Professionelle Webentwicklung & Design Engineering für Unternehmen. Custom Next.js, API-Integrationen und KI-gestützte Automatisierung.',
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
  openGraph: {
    title: 'Kontakt — LW Works GmbH',
    description: 'Professionelle Webentwicklung & Design Engineering für Unternehmen. Custom Next.js, API-Integrationen und KI-gestützte Automatisierung.',
    url: `${baseUrl}/contact`,
    locale: 'de_DE',
  },
}

export default function Contact() {
  return <ContactPage />
}
