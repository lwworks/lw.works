import { Main } from "@/components/main"
import { CalloutSection } from "@/components/sections/callout"
import { CheckCtaSection } from "@/components/sections/check-cta"
import { FaqSection } from "@/components/sections/faq"
import { HandwerkGruendungBenefitsSection } from "@/components/sections/handwerk-gruendung/benefits"
import { HandwerkGruendungHeroSection } from "@/components/sections/handwerk-gruendung/hero"
import { HandwerkGruendungScenariosSection } from "@/components/sections/handwerk-gruendung/scenarios"

export const HandwerkGruendungPage = () => {
  return (
    <Main>
      <HandwerkGruendungHeroSection />
      <HandwerkGruendungBenefitsSection />
      <CalloutSection
        variant="amber"
        content={{
          title: 'Jetzt ist Digitalisierung am günstigsten',
          paragraphs: [
            'Solange Abläufe noch nicht zementiert sind, kostet Aufräumen wenig. Sobald WhatsApp-Chaos und Excel-Listen zur Gewohnheit werden, baust Du später dasselbe System zweimal — einmal falsch, einmal richtig.',
            'Gründung ist der Moment, in dem ein paar klare Wege mehr bringen als jedes Tool, das Du in zwei Jahren wieder ablösen musst.',
          ],
          cta: {
            buttons: [
              {
                label: 'Prozess-Check buchen',
                href: '/check',
              },
            ],
          },
        }}
      />
      <HandwerkGruendungScenariosSection />
      <FaqSection content={{
        id: 'faq',
        brow: 'FAQ',
        title: 'Fragen, die Gründer uns häufig stellen',
        items: [
          {
            question: 'Wir sind gerade erst gegründet — ist das nicht zu früh?',
            answer: ['Im Gegenteil. Solange noch nichts gewachsen ist, lassen sich Anfragen, Angebote und Rechnungen mit wenig Aufwand richtig legen. Später zahlst Du dafür, Gewohnheiten wieder aufzubrechen. Der Prozess-Check zeigt Dir, was sich jetzt lohnt — und was warten kann.'],
          },
          {
            question: 'Wir haben kein Budget für Digitalisierung.',
            answer: ['Der Prozess-Check ist kostenlos und endet nicht in einem Verkaufsgespräch. Du bekommst drei konkrete Hebel schriftlich, die Du mit oder ohne uns umsetzen kannst. Ob und wofür danach Geld fließt, entscheidest Du anhand dieser Ergebnisse — nicht vorher.'],
            cta: {
              label: 'Jetzt Prozess-Check buchen',
              href: '/check',
            },
          },
          {
            question: 'Wir nutzen nur WhatsApp und Excel — reicht das als Grundlage?',
            answer: ['Ja. Genau damit fangen die meisten an. Wir schauen uns an, wie Du heute wirklich arbeitest, und setzen dort an: oft reicht es, bestehende Wege zu ordnen und Tools miteinander sprechen zu lassen, statt alles neu einzuführen.'],
          },
          {
            question: 'Müssen wir neue Software kaufen und das Team anlernen?',
            answer: ['In den meisten Fällen nicht. Zuerst arbeiten wir mit dem, was schon da ist — WhatsApp, Excel, DATEV, Handwerkersoftware. Neue Software schlagen wir nur vor, wenn sie Dir konkret Zeit oder Fehler abnimmt.'],
          },
          {
            question: 'Sind wir hinterher von Euch abhängig?',
            answer: ['Nein. Was wir einrichten, läuft in Euren Accounts und wird so dokumentiert, dass Du es nachvollziehen, am Laufen halten und neue Leute einlernen kannst. Du kannst ohne uns weiterarbeiten.'],
          },
        ],
      }} />
      <CheckCtaSection />
    </Main>
  )
}
