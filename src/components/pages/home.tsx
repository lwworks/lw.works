import { DigitalDealerPromoSection } from "@/components/sections/home/digital-dealer-promo"
import { HomeHeroSection } from "../sections/home/hero"

const digitalDealerPromo = {
  brow: 'Digital Dealer',
  title: 'Autohaus-Websites, die Besucher zu Anfragen machen',
  description:
    'Ein conversion-orientiertes Website-Paket für Autohäuser, das Fahrzeugangebote klar präsentiert und mehr Probefahrt- sowie Kontaktanfragen erzeugt.',
  cta: {
    label: 'Angebot ansehen',
    href: '/digital-dealer',
    urgencyNote: 'Begrenztes Angebot',
  },
  imageAlt: 'Vorschau auf die Digital Dealer Website',
}

export const HomePage = () => {
  return (
    <main className="pt-16">
      <HomeHeroSection />
      <DigitalDealerPromoSection content={digitalDealerPromo} />
    </main>
  )
}
