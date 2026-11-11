import { KontaktPage } from '@/components/pages/kontakt'
import { company } from '@/content/company'
import { baseUrl } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontakt zur LW Works GmbH — per E-Mail, Telefon, WhatsApp oder direkt einen Termin buchen.',
  alternates: {
    canonical: '/kontakt',
  },
}

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: `${baseUrl}/kontakt`,
    inLanguage: 'de-DE',
    mainEntity: {
      '@type': 'Organization',
      name: company.name,
      url: baseUrl,
      email: company.email,
      telephone: company.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: company.address.street,
        postalCode: company.address.postalCode,
        addressLocality: company.address.city,
        addressCountry: company.address.countryCode,
      },
      location: {
        '@type': 'Place',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: company.address.coordinates.lat,
          longitude: company.address.coordinates.lng,
        },
      },
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <KontaktPage />
    </>
  )
}
