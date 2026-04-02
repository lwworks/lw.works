import { Logo } from '@/components/atoms/logo'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getHomeContent } from '@/content/pages/home'
import type { Locale } from '@/i18n/routing'
import { baseUrl, routing } from '@/i18n/routing'
import { ArrowDown, Check, Minus, Plus, Send } from '@mynaui/icons-react'
import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Accordion } from 'radix-ui'

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  const content = await getHomeContent(locale as Locale)

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        de: `${baseUrl}/de`,
        en: `${baseUrl}/en`,
        'x-default': `${baseUrl}/de`,
      },
    },
    openGraph: {
      title: content.metadata.title,
      description: content.metadata.description,
      url: `${baseUrl}/${locale}`,
      locale: locale === 'de' ? 'de_DE' : 'en_US',
    },
  }
}

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const content = await getHomeContent(locale as Locale)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LW Works',
    url: `${baseUrl}/${locale}`,
    inLanguage: locale === 'de' ? 'de-DE' : 'en-US',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="border-b border-black/10 h-16 fixed top-0 w-full bg-white/80 backdrop-blur-lg z-50">
        <div className="relative mx-auto w-full max-w-4xl px-16 h-full flex items-center justify-between border-x border-black/10">
          <Link href="/">
            <Logo className="text-black dark:text-white h-5" />
          </Link>
          <nav className="text-sm">
            <ul className="flex items-center gap-4">
              <li>
                <Link href="/" className="hover:text-black">Entwicklung</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-black">Automatisierung</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-black">Blog</Link>
              </li>
              <li>
                <Button asChild size="sm">
                  <Link href="/">Kontakt</Link>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="pt-16">
        <section className="relative overflow-hidden">
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-32 bg-rose-400 w-3xl h-64 mx-auto blur-3xl opacity-60" style={{ borderRadius: "50% 50%" }} />
          <div className="absolute left-1/2 -translate-x-1/4 -bottom-32 bg-orange-400 w-md h-64 mx-auto blur-3xl opacity-40 mix-blend-color-burn" style={{ borderRadius: "50% 50%" }} />
          <div className="absolute bottom-0 inset-x-0 h-px bg-black/10 z-10" />
          <div className="relative mx-auto w-full max-w-4xl px-16 border-x border-black/10 py-24">
            <Image src="/images/digital-dealer/renault-r5-website.png" alt="Car Detail Page Mockup Explosion" width={1604} height={1025} className="absolute bottom-0 -right-21 max-h-76 w-auto opacity-75" />
            <div className="font-mono text-sm uppercase flex items-center gap-2 mb-8 -mr-16">
              <span className="shrink-0">Digital Dealer</span>
              <div className="flex-1 flex items-center">
                <span className="size-1 shrink-0 bg-indigo-500" />
                <span className="h-px flex-1 bg-linear-to-l from-black/10 via-black/10 to-indigo-500/50" />
              </div>
            </div>
            <h1 className="font-heading text-5xl font-black text-black">Dein Autohaus:<br />Online so stark wie im Showroom.</h1>
            <p className="mt-8 max-w-lg text-balance">Digital Dealer ist das modulare Website-Paket für Autohäuser, die den digitalen ersten Eindruck endlich ernst nehmen. Gebaut auf modernster Technik, conversion-optimiert – und so flexibel, dass es mit Deinem Betrieb mitwächst.</p>
            <div className="flex items-center gap-4 mt-8">
              <Button asChild>
                <Link href="/">
                  <span>Mehr erfahren</span>
                  <ArrowDown className="size-4" strokeWidth={2} />
                </Link>
              </Button>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="shrink-0 size-3 relative flex items-center justify-center">
                  <span className="absolute inset-0 bg-amber-500/20 rounded-full" />
                  <span className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping" />
                  <span className="size-1.5 shrink-0 bg-amber-500 rounded-full" />
                </span>
                Nur noch 5 Plätze verfügbar
              </div>
            </div>
            {/* <p className="mt-8 text-sm max-w-sm">
              <span>Das Angebot zunächst auf fünf Plätze limitiert — alle Preise gelten nur für diese ersten Plätze. </span>
              <Link href="/" className="text-indigo-600 hover:underline">Mehr erfahren</Link>
            </p> */}
          </div>
        </section>
        <section className="border-b border-black/10">
          <div className="relative mx-auto w-full max-w-4xl px-16 border-x border-black/10 py-16">
            <blockquote className="text-xl italic">
              "Endlich sieht unsere Website so aus, wie wir uns selbst sehen. Nicht nach Baukasten, nicht nach 2015. Und mit diesem Angebot wird die Top-Website bezahlbar für alle Autohäuser."
            </blockquote>
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/digital-dealer/christian-brunkhorst.png"
                  alt="Christian Brunkhorst"
                  width={80}
                  height={80}
                  className="size-12 rounded-full object-cover shrink-0 border-2 border-indigo-500"
                />
                <div className="text-black text-sm">
                  <p className="font-medium">Christian Brunkhorst</p>
                  <p className="text-muted-foreground">Geschäftsführer, Autohaus Brunkhorst</p>
                </div>
              </div>
              <Image
                src="/images/digital-dealer/autohaus-brunkhorst.svg"
                alt="Autohaus Brunkhorst"
                width={120}
                height={32}
                className="h-7 w-auto"
              />
            </div>
          </div>
        </section>
        <section className="relative overflow-hidden">
          <div className="absolute right-1/3 translate-x-1/4 -bottom-32 bg-green-500 w-3xl h-48 mx-auto blur-3xl opacity-60" style={{ borderRadius: "50% 50%" }} />
          <div className="absolute left-1/2 -translate-x-1/4 -bottom-32 bg-indigo-400 w-md h-48 mx-auto blur-3xl opacity-40" style={{ borderRadius: "50% 50%" }} />
          <div className="absolute bottom-0 inset-x-0 h-px bg-black/10 z-10" />
          <div className="relative mx-auto w-full max-w-4xl px-16 border-x border-black/10 py-24">
            <div className="font-mono text-sm uppercase flex items-center gap-2 mb-4 -mr-16">
              <span className="shrink-0">Das Problem</span>
              <div className="flex-1 flex items-center">
                <span className="size-1 shrink-0 bg-rose-500" />
                <span className="h-px flex-1 bg-linear-to-l from-black/10 via-black/10 to-rose-500/50" />
              </div>
            </div>
            <h2 className="font-heading text-3xl font-black text-black">Du investierst in deinen Showroom,<br />aber nicht in deine Website.</h2>
            <p className="mt-8">
              Der erste Eindruck eines Autohauses entsteht heute nicht mehr im Showroom. Er entsteht auf dem
              Smartphone, um 22 Uhr, wenn ein potenzieller Käufer nach seinem nächsten Fahrzeug sucht.
            </p>
            <p className="mt-4">
              Studien zeigen: Mehr als 90 % der Autokäufer recherchieren online, bevor sie einen Händler
              kontaktieren. Was sie dabei finden, entscheidet – noch bevor sie auch nur eine Probefahrt buchen. Eine
              langsame, veraltete oder unübersichtliche Website ist in diesem Moment kein Schönheitsfehler. Sie ist
              ein Verkäufer, der Kunden an der Tür abweist.
            </p>
            <p className="mt-4">
              Viele Händler setzen auf jahrelang unangetastete Website-Lösungen, die weder für mobile Endgeräte
              noch für aktuelle SEO-Anforderungen optimiert sind. Google bewertet Ladezeit, Struktur und
              Nutzererfahrung heute härter als je zuvor – und bestraft schlechte Websites mit unsichtbaren Rankings.
            </p>
            <p className="mt-4">
              Gleichzeitig wächst der Wettbewerbsdruck durch große Plattformen wie mobile.de und AutoScout24.
              Die eigene Website ist der einzige digitale Kanal, über den ein Autohaus die volle Kontrolle hat: über
              den ersten Eindruck, über die Konditionen, über die Marke.
            </p>
            <div className="font-mono text-sm uppercase flex items-center gap-2 mb-4 mt-24 -mr-16">
              <span className="shrink-0">Unsere Lösung</span>
              <div className="flex-1 flex items-center">
                <span className="size-1 shrink-0 bg-emerald-500" />
                <span className="h-px flex-1 bg-linear-to-l from-black/10 via-black/10 to-emerald-500/50" />
              </div>
            </div>
            <h2 className="font-heading text-3xl font-black text-black">Das "Digital Dealer" Website-Paket</h2>
            <p className="mt-8">
              Unser Angebot ist genau dafür gebaut – als professionelles, skalierbares Fundament, das (auch kleine) Autohäuser
              wettbewerbsfähig macht und langfristig mitwächst.
            </p>
            <p className="mt-4">
              "Digital Dealer" ist kein Website-Baukasten und keine generische Agenturlösung. Es ist ein modulares Website-System, das speziell für Autohäuser entwickelt wurde – technisch auf dem Stand von 2026, conversion-optimiert von Anfang an und so aufgebaut, dass es nach dem Launch automatisch mitwächst.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <Button asChild>
                <Link href="/">Jetzt deinen Platz sichern</Link>
              </Button>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="shrink-0 size-3 relative flex items-center justify-center">
                  <span className="absolute inset-0 bg-amber-500/20 rounded-full" />
                  <span className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping" />
                  <span className="size-1.5 shrink-0 bg-amber-500 rounded-full" />
                </span>
                Nur noch 5 Plätze verfügbar
              </div>
            </div>
          </div>
        </section>
        <section id="preise" className="border-b border-black/10">
          <h2 className="sr-only">Digital Dealer: Unsere Paket-Preise</h2>
          <div className="relative mx-auto w-full max-w-4xl px-16 border-x border-b border-black/10 py-16">
            <div className="flex items-start justify-between gap-x-16">
              <div>
                <p className="font-mono text-xs uppercase mb-2">Basis-Paket</p>
                <h3 className="font-heading text-xl font-black text-black"><i>Digital Dealer</i> – die solide Basis</h3>
              </div>
              <div className="flex flex-col items-end whitespace-nowrap shrink-0">
                <span className="text-xl font-mono">
                  <span className="line-through text-black">9.995 €</span>
                  <span className="text-rose-500"> 6.995 €</span>
                </span>
                <span className="text-sm font-mono text-black">+ 39 €/Monat</span>
              </div>
            </div>
            <p className="mt-4">
              Keine Kompromisse bei der Technik. Die Website lädt schnell, rankt bei Google und ist so gebaut, dass jede Erweiterung sauber integriert werden kann – heute und in zwei Jahren.
            </p>
            <ul className="mt-4 space-y-1">
              <li className="flex items-start gap-2">
                <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                <span>Modernste Next.js-Architektur mit Top-PageSpeed-Werten</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                <span>Technische SEO vollständig umgesetzt</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                <span>Modularer Code – kein Flickenteppich, kein Anbieter-Lock-in</span>
              </li>
            </ul>
            <Accordion.Root type="single" collapsible className="mt-8">
              <Accordion.Item value="highlights" className="-mr-16">
                <Accordion.Trigger className="group flex w-full items-center gap-2 hover:text-black cursor-pointer">
                  <div className="relative size-4">
                    <Plus className="absolute size-4 shrink-0 text-indigo-600 group-aria-expanded:-rotate-180 group-aria-expanded:opacity-0 transition duration-300" strokeWidth={2} />
                    <Minus className="absolute size-4 shrink-0 text-indigo-600 opacity-0 group-aria-expanded:-rotate-180 group-aria-expanded:opacity-100 transition duration-300" strokeWidth={2} />
                  </div>
                  <span className="group-aria-expanded:hidden">Details anzeigen</span>
                  <span className="hidden group-aria-expanded:inline">Details ausblenden</span>
                  <div className="flex-1 flex items-center">
                    <span className="size-1 shrink-0 bg-indigo-500" />
                    <span className="h-px flex-1 bg-linear-to-l from-black/10 via-black/10 to-indigo-500/50" />
                  </div>
                </Accordion.Trigger>
                <Accordion.Content className="grid grid-cols-2 gap-x-16 gap-y-8 pt-8 pr-16 text-sm">
                  <div>
                    <h4 className="font-medium text-black text-base">Technische Highlights</h4>
                    <p className="mt-4">Modernste Web-Architektur: sicher, schnell und DSGVO-konform.</p>
                    <ul className="mt-4 space-y-1">
                      <li className="flex items-start gap-2">
                        <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                        <span>Performance-Optimierung</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                        <span>Technische Suchmaschinenoptimierung</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                        <span>Modularer Aufbau für einfache Erweiterung & Integration</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-black text-base">Design-Highlights</h4>
                    <p className="mt-4">
                      Kein Design von der Stange. Unsere Designer entwickeln den perfekten modernen
                      Auftritt für Dein Autohaus.
                    </p>
                    <ul className="mt-4 space-y-1">
                      <li className="flex items-start gap-2">
                        <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                        <span>Modernes Design-System basierend auf Deiner Marke</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                        <span>Klarer Fokus auf UX (Nutzererfahrung)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                        <span>Conversion-optimierter Seitenaufbau</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-black text-base">Inhalte</h4>
                    <p className="mt-4">
                      Gut konzipierte Texte und Inhalte sind die Basis, auf der ein gutes Ranking in der
                      Google-Suche fußt.
                    </p>
                    <ul className="mt-4 space-y-1">
                      <li className="flex items-start gap-2">
                        <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                        <span>Fahrzeugangebote und Suchfunktion</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                        <span>Suchmaschinenoptimierte Texte für Deine Marken & Modelle</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                        <span>Unternehmens- und Karriereseiten</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                        <span>Werkstatt- und Serviceangebote</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-black text-base">Integrationen</h4>
                    <p className="mt-4">
                      Automatische Verknüpfungen reduzieren Deinen Aufwand auf ein Minimum.
                    </p>
                    <ul className="mt-4 space-y-1">
                      <li className="flex items-start gap-2">
                        <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                        <span>Fahrzeugangebote: CXO oder ähnliche Fahrzeugverwaltung</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                        <span>Lead-Management: Leads landen direkt in deinem Postfach oder CRM</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                        <span>Google Maps: Deine Kunden (und Google) werden Dich finden</span>
                      </li>
                    </ul>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>
          <div className="relative mx-auto w-full max-w-4xl px-16 border-x border-b border-black/10 py-16">
            <div className="flex items-start justify-between gap-x-16">
              <div>
                <p className="font-mono text-xs uppercase mb-2">Zusatz-Paket</p>
                <h3 className="font-heading text-xl font-black text-black"><i>Service</i> – Werkstatt-Termine, die sich selbst buchen</h3>
              </div>
              <div className="flex flex-col items-end whitespace-nowrap shrink-0">
                <span className="text-xl font-mono">
                  <span className="line-through text-black">1.495 €</span>
                  <span className="text-rose-500"> 995 €</span>
                </span>
              </div>
            </div>
            <p className="mt-4">
              Deine Werkstatt ist oft Dein profitabelster Bereich – aber die meisten Kunden buchen nicht spontan online. Mit diesem Paket läuft die Terminbuchung rund um die Uhr, ohne dass jemand abheben muss.
            </p>
            <ul className="mt-4 space-y-1">
              <li className="flex items-start gap-2">
                <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                <span>Buchungsstrecke mit Fahrzeug- und Serviceauswahl</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                <span>Kalenderbasierte Terminwahl mit Echtzeit-Verfügbarkeit</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                <span>Automatische Bestätigung und Erinnerung an den Kunden</span>
              </li>
            </ul>
          </div>
          <div className="relative mx-auto w-full max-w-4xl px-16 border-x border-b border-black/10 py-16">
            <div className="flex items-start justify-between gap-x-16">
              <div>
                <p className="font-mono text-xs uppercase mb-2">Zusatz-Paket</p>
                <h3 className="font-heading text-xl font-black text-black"><i>Convert</i> – Aus Besuchern werden Anfragen</h3>
              </div>
              <div className="flex flex-col items-end whitespace-nowrap shrink-0">
                <span className="text-xl font-mono">
                  <span className="line-through text-black">1.495 €</span>
                  <span className="text-rose-500"> 995 €</span>
                </span>
              </div>
            </div>
            <p className="mt-4">
              Traffic auf die Website zu bekommen ist die halbe Miete. Die andere Hälfte: Besucher in konkrete Leads verwandeln. Dieses Paket bringt Probefahrt-Buchung, Finanzierungsrechner und WhatsApp-Kontakt direkt dorthin, wo der Kunde gerade entscheidet – ins Fahrzeuginserat.
            </p>
            <ul className="mt-4 space-y-1">
              <li className="flex items-start gap-2">
                <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                <span>Probefahrt-Buchung mit Wunschtermin und Echtzeit-Verfügbarkeit</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                <span>Interaktiver Leasing- und Finanzierungsrechner je Fahrzeugangebot</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                <span>WhatsApp-Integration als direkter Conversion-Booster</span>
              </li>
            </ul>
          </div>
          <div className="relative mx-auto w-full max-w-4xl px-16 border-x border-b border-black/10 py-16">
            <div className="flex items-start justify-between gap-x-16">
              <div>
                <p className="font-mono text-xs uppercase mb-2">Zusatz-Paket</p>
                <h3 className="font-heading text-xl font-black text-black"><i>Scale</i> – Multi-Standort und Multi-Marke</h3>
              </div>
              <div className="flex flex-col items-end whitespace-nowrap shrink-0">
                <span className="text-xl font-mono">
                  <span className="line-through text-black">1.495 €</span>
                  <span className="text-rose-500"> 995 €</span>
                </span>
              </div>
            </div>
            <p className="mt-4">
              Wer mehrere Standorte oder Marken betreibt, braucht kein dreifaches Website-Chaos. Scale bündelt alles in einer sauberen Architektur – mit zentralem Fahrzeugpool, lokalen Seiten für jede Filiale und SEO-Sichtbarkeit für jeden Standort einzeln.
            </p>
            <ul className="mt-4 space-y-1">
              <li className="flex items-start gap-2">
                <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                <span>Standortspezifische Seiten mit Team, Öffnungszeiten und Google Maps</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                <span>SEO-optimierte Unterseiten für lokale Suchanfragen</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                <span>Gemeinsamer Fahrzeugpool aus allen Standorten und Marken, mit Standortfilter</span>
              </li>
            </ul>
          </div>
          <div className="relative mx-auto w-full max-w-4xl px-16 border-x border-black/10 py-16">
            <div className="flex items-start justify-between gap-x-16">
              <div>
                <p className="font-mono text-xs uppercase mb-2">Zusatz-Paket</p>
                <h3 className="font-heading text-xl font-black text-black"><i>Growth</i> – Deine Website wächst mit</h3>
              </div>
              <div className="flex flex-col items-end whitespace-nowrap shrink-0">
                <span className="text-xl font-mono text-black">
                  195 €<span className="text-sm">/Monat</span>
                </span>
              </div>
            </div>
            <p className="mt-4">
              Nach dem Launch beginnt das Tagesgeschäft. Growth stellt sicher, dass Deine Website dauerhaft aktuell bleibt: Inhalte ändern per Texteingabe, neue SEO-Seiten entstehen automatisch, wenn ein neues Modell auf den Markt kommt – ohne Agentur-Briefing, ohne Wartezeit.
            </p>
            <ul className="mt-4 space-y-1">
              <li className="flex items-start gap-2">
                <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                <span>Inhalte, Texte und Bilder per natürlichsprachiger Eingabe anpassen (<Link href="https://ai-cms.dev" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline hover:text-indigo-800">aiCMS</Link>)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                <span>Automatisch neue SEO-Seiten für neue Modelle und Aktionen</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                <span>Technisches Monitoring, Performance-Updates und direkter Ansprechpartner inklusive</span>
              </li>
            </ul>
          </div>
        </section>
        <section id="kontakt" className="relative overflow-hidden">
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-32 bg-indigo-400 w-3xl h-64 mx-auto blur-3xl opacity-60" style={{ borderRadius: "50% 50%" }} />
          <div className="absolute left-1/3 -translate-x-1/4 -bottom-32 bg-violet-400 w-md h-64 mx-auto blur-3xl opacity-40" style={{ borderRadius: "50% 50%" }} />
          <div className="absolute bottom-0 inset-x-0 h-px bg-black/10 z-10" />
          <div className="relative mx-auto w-full max-w-4xl px-16 border-x border-black/10 py-24">
            <div className="font-mono text-sm uppercase flex items-center gap-2 mb-4 -mr-16">
              <span className="shrink-0">Platz sichern</span>
              <div className="flex-1 flex items-center">
                <span className="size-1 shrink-0 bg-indigo-500" />
                <span className="h-px flex-1 bg-linear-to-l from-black/10 via-black/10 to-indigo-500/50" />
              </div>
            </div>
            <h2 className="font-heading text-3xl font-black text-black">Jetzt unverbindlich anfragen</h2>
            <p className="mt-4 max-w-lg">
              Sichere Dir einen der limitierten Plätze. Füll das Formular aus, und wir melden uns innerhalb von 24 Stunden bei Dir.
            </p>
            <form className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Max Mustermann" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dealership">Autohaus</Label>
                <Input id="dealership" name="dealership" placeholder="Autohaus Mustermann" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" name="email" type="email" placeholder="max@autohaus-mustermann.de" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+49 123 456 789" />
              </div>
              <fieldset className="col-span-2 mt-2">
                <legend className="text-sm font-medium mb-4">Welche Pakete interessieren Dich?</legend>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 rounded-lg border border-black/10 bg-indigo-50/50 px-4 py-3 cursor-default">
                    <Checkbox checked disabled className="opacity-60" />
                    <div>
                      <span className="text-sm font-medium text-black">Basis-Paket</span>
                      <span className="block text-xs text-muted-foreground">Immer enthalten</span>
                    </div>
                  </label>
                  <label htmlFor="plan-service" className="flex items-center gap-3 rounded-lg border border-black/10 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50/50">
                    <Checkbox id="plan-service" name="plans" value="service" />
                    <div>
                      <span className="text-sm font-medium text-black">Service</span>
                      <span className="block text-xs text-muted-foreground">Werkstatt-Terminbuchung</span>
                    </div>
                  </label>
                  <label htmlFor="plan-convert" className="flex items-center gap-3 rounded-lg border border-black/10 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50/50">
                    <Checkbox id="plan-convert" name="plans" value="convert" />
                    <div>
                      <span className="text-sm font-medium text-black">Convert</span>
                      <span className="block text-xs text-muted-foreground">Probefahrt, Finanzierung, WhatsApp</span>
                    </div>
                  </label>
                  <label htmlFor="plan-scale" className="flex items-center gap-3 rounded-lg border border-black/10 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50/50">
                    <Checkbox id="plan-scale" name="plans" value="scale" />
                    <div>
                      <span className="text-sm font-medium text-black">Scale</span>
                      <span className="block text-xs text-muted-foreground">Multi-Standort & Multi-Marke</span>
                    </div>
                  </label>
                  <label htmlFor="plan-growth" className="flex items-center gap-3 rounded-lg border border-black/10 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50/50">
                    <Checkbox id="plan-growth" name="plans" value="growth" />
                    <div>
                      <span className="text-sm font-medium text-black">Growth</span>
                      <span className="block text-xs text-muted-foreground">KI-CMS, automatische SEO-Seiten</span>
                    </div>
                  </label>
                </div>
              </fieldset>
              <div className="col-span-2 mt-2">
                <Button type="submit">
                  <span>Anfrage senden</span>
                  <Send className="size-4" strokeWidth={2} />
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <footer className="text-sm text-neutral-500">
        <div className="relative mx-auto w-full max-w-4xl px-16 border-x border-black/10 py-24 grid grid-cols-4">
          <div>
            <Link href="/">
              <Logo className="text-black dark:text-white h-5" />
            </Link>
          </div>
          <div>
            <h4 className="font-semibold text-black text-[11px] uppercase mb-3 tracking-widest">Unternehmen</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/" className="hover:text-black">Impressum</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-black">Datenschutz</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-black">AGB</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-black">Kontakt</Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}
