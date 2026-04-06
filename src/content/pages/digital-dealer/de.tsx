import { DigitalDealerPageContent } from '@/components/pages/digital-dealer'
import { Link } from '@/i18n/link'
import { ComponentProps } from 'react'

const content: DigitalDealerPageContent = {
  metadata: {
    title: 'Digital Dealer: Website-Paket für Autohäuser — LW Works GmbH',
    description:
      'Das modulare Website-Paket für Autohäuser, die den digitalen ersten Eindruck endlich ernst nehmen. Gebaut auf modernster Technik, conversion-optimiert – und so flexibel, dass es mit Deinem Betrieb mitwächst.'
  },
  hero: {
    imageAlt: 'Renault R5 Website Mockup',
    brow: 'Digital Dealer',
    title: 'Dein Autohaus: Online so stark wie im Showroom.',
    description:
      'Digital Dealer ist das modulare Website-Paket für Autohäuser, die den digitalen ersten Eindruck endlich ernst nehmen. Gebaut auf modernster Technik, conversion-optimiert – und so flexibel, dass es mit Deinem Betrieb mitwächst.',
    cta: {
      href: '#angebot',
      label: 'Mehr erfahren',
      urgencyNote: 'Nur noch 5 Plätze verfügbar'
    }
  },
  testimonial: {
    quote:
      'Endlich sieht unsere Website so aus, wie wir uns selbst sehen. Nicht nach Baukasten, nicht nach 2015. Und mit diesem Angebot wird die Top-Website bezahlbar für alle Autohäuser.',
    client: {
      name: 'Christian Brunkhorst',
      description: 'Geschäftsführer, Autohaus Brunkhorst',
      avatar: '/images/digital-dealer/christian-brunkhorst.png'
    },
    logo: {
      srcDark: '/images/digital-dealer/autohaus-brunkhorst-weiss.svg',
      srcLight: '/images/digital-dealer/autohaus-brunkhorst-schwarz.svg',
      alt: 'Autohaus Brunkhorst Logo',
      width: 120,
      height: 32
    }
  },
  problem: {
    brow: 'Das Problem',
    title: 'Du investierst in deinen Showroom, aber nicht in deine Website.',
    paragraphs: [
      'Der erste Eindruck eines Autohauses entsteht heute nicht mehr im Showroom. Er entsteht auf dem Smartphone, um 22 Uhr, wenn ein potenzieller Käufer nach seinem nächsten Fahrzeug sucht.',
      'Studien zeigen: Mehr als 90 % der Autokäufer recherchieren online, bevor sie einen Händler kontaktieren. Was sie dabei finden, entscheidet – noch bevor sie auch nur eine Probefahrt buchen. Eine langsame, veraltete oder unübersichtliche Website ist in diesem Moment kein Schönheitsfehler. Sie ist ein Verkäufer, der Kunden an der Tür abweist.',
      'Viele Händler setzen auf jahrelang unangetastete Website-Lösungen, die weder für mobile Endgeräte noch für aktuelle SEO-Anforderungen optimiert sind. Google bewertet Ladezeit, Struktur und Nutzererfahrung heute härter als je zuvor – und bestraft schlechte Websites mit unsichtbaren Rankings.',
      'Gleichzeitig wächst der Wettbewerbsdruck durch große Plattformen wie mobile.de und AutoScout24. Die eigene Website ist der einzige digitale Kanal, über den ein Autohaus die volle Kontrolle hat: über den ersten Eindruck, über die Konditionen, über die Marke.'
    ]
  },
  solution: {
    id: 'angebot',
    brow: 'Unsere Lösung',
    title: 'Das "Digital Dealer" Website-Paket',
    paragraphs: [
      'Unser Angebot ist genau dafür gebaut – als professionelles, skalierbares Fundament, das (auch kleine) Autohäuser wettbewerbsfähig macht und langfristig mitwächst.',
      '"Digital Dealer" ist kein Website-Baukasten und keine generische Agenturlösung. Es ist ein modulares Website-System, das speziell für Autohäuser entwickelt wurde – technisch auf dem Stand von 2026, conversion-optimiert von Anfang an und so aufgebaut, dass es nach dem Launch automatisch mitwächst.'
    ],
  },
  callout: {
    title: 'Begrenzt auf 5 Plätze',
    paragraphs: [
      'Wir möchten erstklassige Websites für alle Autohäuser bezahlbar machen. Damit wir das modulare System profitabel entwickeln können, auf dem solche Websites basieren, brauchen wir Dich und vier weitere Autohäuser.',
      'Für diese begrenzten fünf Plätze bieten wir reduzierte Preise an, bevor wir das Paket anschließend für den regulären Preis anbieten.'
    ],
    cta: {
      buttons: [
        {
          label: 'Jetzt deinen Platz sichern',
          href: '#platz-sichern'
        }
      ],
      urgencyNote: 'Nur noch 5 Plätze verfügbar'
    }
  },
  pricing: {
    id: 'preise',
    title: 'Digital Dealer: Unsere Paket-Preise',
    items: [
      {
        brow: 'Basis-Paket',
        title: 'Digital Dealer – die solide Basis',
        price: {
          original: '8.495 €',
          now: '5.995 €',
          additional: '+ 39 €/Monat'
        },
        description:
          'Keine Kompromisse bei der Technik. Die Website lädt schnell, rankt bei Google und ist so gebaut, dass jede Erweiterung sauber integriert werden kann – heute und in zwei Jahren.',
        features: [
          'Modernste Next.js-Architektur mit Top-PageSpeed-Werten',
          'Technische SEO vollständig umgesetzt',
          'Modularer Code – kein Flickenteppich, kein Anbieter-Lock-in'
        ],
        details: {
          collapsedLabel: 'Details anzeigen',
          expandedLabel: 'Details ausblenden',
          items: [
            {
              title: 'Technische Highlights',
              description: 'Modernste Web-Architektur: sicher, schnell und DSGVO-konform.',
              features: ['Performance-Optimierung', 'Technische Suchmaschinenoptimierung', 'Modularer Aufbau für einfache Erweiterung & Integration']
            },
            {
              title: 'Design-Highlights',
              description: 'Kein Design von der Stange. Unsere Designer entwickeln den perfekten Auftritt für Dein Autohaus.',
              features: [
                'Modernes Design-System basierend auf Deiner Marke',
                'Klarer Fokus auf UX (Nutzererfahrung)',
                'Conversion-optimierter Seitenaufbau'
              ]
            },
            {
              title: 'Inhalte',
              description: 'Gut konzipierte Texte und Inhalte sind die Basis, auf der ein gutes Ranking in der Google-Suche fußt.',
              features: [
                'Fahrzeugangebote und Suchfunktion',
                'Suchmaschinenoptimierte Texte für Deine Marken & Modelle',
                'Unternehmens- und Karriereseiten',
                'Werkstatt- und Serviceangebote'
              ]
            },
            {
              title: 'Integrationen',
              description: 'Automatische Verknüpfungen reduzieren Deinen Aufwand auf ein Minimum.',
              features: [
                'Fahrzeugangebote: CXO oder ähnliche Fahrzeugverwaltung',
                'Lead-Management: Leads landen direkt in deinem Postfach oder CRM',
                'Google Maps: Deine Kunden (und Google) werden Dich finden'
              ]
            }
          ]
        }
      },
      {
        brow: 'Zusatz-Paket',
        title: 'Service – Werkstatt-Termine, die sich selbst buchen',
        price: {
          original: '1.495 €',
          now: '995 €'
        },
        description:
          'Deine Werkstatt ist oft Dein profitabelster Bereich – aber die meisten Kunden buchen nicht spontan online. Mit diesem Paket läuft die Terminbuchung rund um die Uhr, ohne dass jemand abheben muss.',
        features: [
          'Buchungsstrecke mit Fahrzeug- und Serviceauswahl',
          'Kalenderbasierte Terminwahl mit Echtzeit-Verfügbarkeit',
          'Automatische Bestätigung und Erinnerung an den Kunden'
        ]
      },
      {
        brow: 'Zusatz-Paket',
        title: 'Convert – Aus Besuchern werden Anfragen',
        price: {
          original: '1.495 €',
          now: '995 €'
        },
        description:
          'Traffic auf die Website zu bekommen ist die halbe Miete. Die andere Hälfte: Besucher in konkrete Leads verwandeln. Dieses Paket bringt Probefahrt-Buchung, Finanzierungsrechner und WhatsApp-Kontakt direkt dorthin, wo der Kunde gerade entscheidet – ins Fahrzeuginserat.',
        features: [
          'Probefahrt-Buchung mit Wunschtermin und Echtzeit-Verfügbarkeit',
          'Interaktiver Leasing- und Finanzierungsrechner je Fahrzeugangebot',
          'WhatsApp-Integration als direkter Conversion-Booster'
        ]
      },
      {
        brow: 'Zusatz-Paket',
        title: 'Scale – Multi-Standort und Multi-Marke',
        price: {
          original: '1.495 €',
          now: '995 €'
        },
        description:
          'Wer mehrere Standorte oder Marken betreibt, braucht kein dreifaches Website-Chaos. Scale bündelt alles in einer sauberen Architektur – mit zentralem Fahrzeugpool, lokalen Seiten für jede Filiale und SEO-Sichtbarkeit für jeden Standort einzeln.',
        features: [
          'Standortspezifische Seiten mit Team, Öffnungszeiten und Google Maps',
          'SEO-optimierte Unterseiten für lokale Suchanfragen',
          'Gemeinsamer Fahrzeugpool aus allen Standorten und Marken, mit Standortfilter'
        ]
      },
      {
        brow: 'Zusatz-Paket',
        title: 'Growth – Deine Website wächst mit',
        price: {
          now: '195 €',
          additional: '/Monat'
        },
        description:
          'Nach dem Launch beginnt das Tagesgeschäft. Growth stellt sicher, dass Deine Website dauerhaft aktuell bleibt: Inhalte ändern per Texteingabe, neue SEO-Seiten entstehen automatisch, wenn ein neues Modell auf den Markt kommt – ohne Agentur-Briefing, ohne Wartezeit.',
        features: [
          'Inhalte, Texte und Bilder per natürlichsprachiger Eingabe anpassen',
          'Automatisch neue SEO-Seiten für neue Modelle und Aktionen',
          'Technisches Monitoring, Performance-Updates und direkter Ansprechpartner inklusive'
        ]
      }
    ]
  },
  contact: {
    locale: 'de',
    id: 'platz-sichern',
    brow: 'Kontakt',
    title: 'Jetzt unverbindlich anfragen',
    description: 'Sichere Dir einen der limitierten Plätze. Fülle das Formular aus, und wir melden uns innerhalb von 24 Stunden bei Dir.',
    fields: {
      name: {
        label: 'Name',
        placeholder: 'Max Mustermann'
      },
      dealership: {
        label: 'Autohaus',
        placeholder: 'Autohaus Mustermann'
      },
      email: {
        label: 'E-Mail',
        placeholder: 'max@autohaus-mustermann.de'
      },
      phone: {
        label: 'Telefon',
        placeholder: '+49 123 456 789'
      }
    },
    plans: {
      label: 'Welche Pakete interessieren Dich?',
      base: {
        label: 'Basis-Paket – die solide Basis',
        description: 'Immer enthalten'
      },
      service: {
        label: 'Paket Service',
        description: 'Werkstatt-Termine, die sich selbst buchen'
      },
      convert: {
        label: 'Paket Convert',
        description: 'Besucher in konkrete Leads verwandeln'
      },
      scale: {
        label: 'Paket Scale',
        description: 'Mehrere Standorte & Marken'
      },
      growth: {
        label: 'Paket Growth',
        description: 'Deine Website wächst mit'
      }
    },
    privacy: <>Ich habe die <Link href={"/privacy" as ComponentProps<typeof Link>['href']} target="_blank" className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800 dark:hover:text-indigo-500">Datenschutzerklärung</Link> gelesen und bin mit der Verarbeitung meiner Daten einverstanden.</>,
    submit: 'Anfrage senden',
    urgencyNote: 'Nur noch 5 Plätze verfügbar',
    successMessage: 'Deine Anfrage wurde erfolgreich gesendet. Wir melden uns in Kürze!'
  },
  faq: {
    id: 'digital-dealer-faq',
    brow: 'FAQ',
    title: 'Fragen zu Digital Dealer',
    description: 'Kurze Antworten unter dem Formular. Fehlt etwas, schreibt uns gern über die Felder oben.',
    items: [
      {
        question: 'Wie schnell meldet ihr euch nach meiner Anfrage?',
        answer: [
          'In der Regel innerhalb eines Werktags. Direkt nach dem Absenden bekommst du außerdem eine Bestätigung per E-Mail.',
          'Brauchen wir mehr Details für ein Angebot, sagen wir das in der ersten Antwort.'
        ]
      },
      {
        question: 'Wie hängen die Zusatzpakete mit dem Basis-Paket zusammen?',
        answer: [
          'Das Basis-Paket ist immer dabei — technische und gestalterische Grundlage. Service, Convert, Scale und Growth erweitern sie um konkrete Funktionen wie Werkstattbuchung, Lead-Tools, Mehr-Standort-Setups und laufenden Content-Ausbau.',
          'Du kannst im Formular ankreuzen, was dich interessiert; auf einem kurzen Call klären wir Passung und Reihenfolge.'
        ],
        cta: {
          label: 'Preise und Leistungen vergleichen',
          href: '#pricing' as ComponentProps<typeof Link>['href']
        }
      },
      {
        question: 'Können wir nur mit Basis starten und später nachrüsten?',
        answer: [
          'Ja. Viele Autohäuser beginnen mit dem Basis-Paket und ergänzen Add-ons, sobald Abläufe und Prioritäten klar sind.',
          'Die Architektur ist darauf ausgelegt, dass Erweiterungen sauber integrierbar bleiben — statt später separate Insellösungen nachzuziehen.'
        ]
      }
    ]
  }
}

export default content
