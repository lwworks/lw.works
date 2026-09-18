import { HandwerkGruendungPage } from '@/components/pages/handwerk-gruendung'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Digitalisierung für junge Handwerksbetriebe',
  description: 'Frisch gegründet? Setz Anfragen, Angebote, Termine und Rechnungen jetzt so auf, dass Du auf der Baustelle bleibst — nicht im Büro. Kostenloser Prozess-Check, ohne Verkaufsgespräch.',
  alternates: {
    canonical: '/handwerk-gruendung',
  },
}

export default function HandwerkGruendung() {
  return <HandwerkGruendungPage />
}
