import { HomePage } from '@/components/pages/home'
import { baseUrl } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home — LW Works GmbH',
  description: 'Professionelle Webentwicklung & Design Engineering für Unternehmen. Custom Next.js, API-Integrationen und KI-gestützte Automatisierung.',
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: 'Home — LW Works GmbH',
    description: 'Professionelle Webentwicklung & Design Engineering für Unternehmen. Custom Next.js, API-Integrationen und KI-gestützte Automatisierung.',
    url: baseUrl,
    locale: 'de_DE',
  },
}

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LW Works',
    url: baseUrl,
    inLanguage: 'de-DE',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomePage />
    </>
  )
}
