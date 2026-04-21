import {HomePageContent} from '@/components/pages/home'
import {getPageSlug} from '@/content/pages/slugs'

const content: HomePageContent = {
  metadata: {
    title: 'Home — LW Works GmbH',
    description: 'Professionelle Webentwicklung & Design Engineering für Unternehmen. Custom Next.js, API-Integrationen und KI-gestützte Automatisierung.'
  },
  digitalDealerPromo: {
    brow: 'Digital Dealer',
    title: 'Autohaus-Websites, die Besucher zu Anfragen machen',
    description:
      'Ein conversion-orientiertes Website-Paket für Autohäuser, das Fahrzeugangebote klar präsentiert und mehr Probefahrt- sowie Kontaktanfragen erzeugt.',
    cta: {
      label: 'Angebot ansehen',
      href: `/${getPageSlug('digital-dealer', 'de')}`,
      urgencyNote: 'Begrenztes Angebot'
    },
    imageAlt: 'Vorschau auf die Digital Dealer Website'
  }
}

export default content
