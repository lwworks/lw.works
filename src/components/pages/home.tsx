import { CheckCtaSection } from "../sections/check-cta"
import { FaqSection } from "../sections/faq"
import { HomeHeroSection } from "../sections/home/hero"
import { PainPointsSection } from "../sections/home/pain-points"
import { ServicesSection } from "../sections/home/services"
import { SolutionSection } from "../sections/home/solution"
import { LogosSection } from "../sections/logos"

export const HomePage = () => {
  return (
    <main className="pt-16">
      <HomeHeroSection />
      <LogosSection logos={["airbus", "amazon", "bmw", "livestore", "brunkhorst", "effect", "lehmann", "porsche", "scoo", "urlbox"]} variant="carousel" />
      <PainPointsSection />
      <SolutionSection />
      <ServicesSection />
      <FaqSection content={{
        id: 'faq',
        brow: 'FAQ',
        title: 'Ehrliche Antworten auf häufige Fragen',
        items: [
          {
            question: 'Wir haben schon schlechte Erfahrungen mit Beratungen gemacht — was macht Ihr anders?',
            answer: ['Der Unterschied ist im Grunde ganz einfach: Wir sind keine Beratungsagentur. Wir setzen um. Es gibt bei uns kein Angebot, durch das Du nicht direkt sichtbare Ergebnisse erzielst.']
          },
          {
            question: 'Müssen wir neue Software einführen und das Team anlernen?',
            answer: ['In den meisten Fällen nicht — und müssen sowieso nicht. Zunächst arbeiten wir mit den Systemen, die Ihr bereits nutzt: Die meisten Softwarelösungen bieten Schnittstellen, die wir einsetzen können. So können wir Teilabläufe vereinfachen, automatisieren und ggf. mit KI ergänzen. Neue Software schlagen wir nur dann vor, wenn sie Dir wirklich konkreten Mehrwert bringt.'],
          },
          {
            question: 'Was kostet uns die Zusammenarbeit?',
            answer: ['Das lässt sich vorab nicht pauschal sagen. Was wir aber sagen können: Dein Prozess-Check ist kostenlos. Anhand der Ergebnisse des Prozess-Checks können wir dann gemeinsam besprechen, ob und zu welchen Konditionen eine Zusammenarbeit sinnvoll ist.'],
            cta: {
              label: 'Jetzt Prozess-Check buchen',
              href: '/check',
            }
          },
          {
            question: 'Ist KI für uns überhaupt relevant?',
            answer: ['Wahrscheinlich mehr als Du denkst. Aber KI ist kein Selbstzweck: Wir entwickeln keine KI-Integration, nur um KI zu nutzen. Stattdessen schauen wir uns genau an, an welchen Stellen KI-Integrationen in Deinem Unternehmen wirklich Mehrwert liefern können — sei es in der Geschwindigkeit, in den Kosten oder in der Zuverlässigkeit von Abläufen.'],
          },
          {
            question: 'Sind wir nach einer Zusammenarbeit von Euch abhängig?',
            answer: ['Nein. Alle Prozesse und Systeme, die wir entwickeln oder anpassen, werden sauber dokumentiert und laufen in Euren Systemen und Accounts. So habt Ihr alles, was Ihr braucht, um sämtliche Datenverarbeitungen nachzuvollziehen, Prozesse am Laufen zu halten und neue Mitarbeitende einzulernen. Damit kannst Du auch ohne uns weiter arbeiten, wenn Du magst.']
          }
        ],
      }} />
      <CheckCtaSection />
    </main>
  )
}
