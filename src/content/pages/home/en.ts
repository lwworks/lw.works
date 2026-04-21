import {HomePageContent} from '@/components/pages/home'
import {getPageSlug} from '@/content/pages/slugs'

const content: HomePageContent = {
  metadata: {
    title: 'Home — LW Works GmbH',
    description: 'Professional web development & design engineering for companies. Custom Next.js, API integrations and AI-powered automation.'
  },
  digitalDealerPromo: {
    brow: 'Digital Dealer',
    title: 'Car dealership websites that turn visitors into leads',
    description:
      'A conversion-focused website package for car dealerships that presents vehicle inventory clearly and generates more test drive and contact inquiries.',
    cta: {
      label: 'View offer',
      href: `/${getPageSlug('digital-dealer', 'en')}`,
      urgencyNote: 'Limited offer'
    },
    imageAlt: 'Preview of the Digital Dealer website'
  }
}

export default content
