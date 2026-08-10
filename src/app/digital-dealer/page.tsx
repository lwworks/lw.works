import { DigitalDealerPage, digitalDealerMetadata } from '@/components/pages/digital-dealer'
import { baseUrl } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  ...digitalDealerMetadata,
  alternates: {
    canonical: `${baseUrl}/digital-dealer`,
  },
  openGraph: {
    title: digitalDealerMetadata.title!,
    description: digitalDealerMetadata.description!,
    url: `${baseUrl}/digital-dealer`,
    locale: 'de_DE',
  },
}

export default function DigitalDealer() {
  return <DigitalDealerPage />
}
