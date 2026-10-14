import { HomePage } from '@/components/pages/home'
import { baseUrl } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Digitalisierung für den Mittelstand',
  description: 'Die LW Works GmbH macht mittelständische Unternehmen in Deutschland wettbewerbsfähiger und profitabler. Wir finden Engpässe in gewachsenen Prozessen und lösen sie mit Automatisierung, Schnittstellen und KI-Integration – mit Software statt Beratungs-Folien.',
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: 'Digitalisierung für den Mittelstand — LW Works GmbH',
    description: 'Die LW Works GmbH macht mittelständische Unternehmen in Deutschland wettbewerbsfähiger und profitabler. Wir finden Engpässe in gewachsenen Prozessen und lösen sie mit Automatisierung, Schnittstellen und KI-Integration – mit Software statt Beratungs-Folien.',
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
