import { ContactPageContent } from '@/components/pages/contact'
import { Link } from '@/i18n/link'
import type { ComponentProps } from 'react'

const content: ContactPageContent = {
  metadata: {
    title: 'Kontakt — LW Works GmbH',
    description: 'Professionelle Webentwicklung & Design Engineering für Unternehmen. Custom Next.js, API-Integrationen und KI-gestützte Automatisierung.'
  },
  form: {
    id: 'kontakt',
    brow: 'Kontakt',
    title: 'Sprechen wir über Ihr Projekt',
    description: 'Schreiben Sie uns, was Sie vorhaben. Wir lesen jede Nachricht und melden uns in der Regel innerhalb eines Werktags.',
    fields: {
      name: {
        label: 'Name',
        placeholder: 'Ihr Name'
      },
      email: {
        label: 'E-Mail',
        placeholder: 'sie@unternehmen.de'
      },
      message: {
        label: 'Nachricht',
        placeholder: 'Worum geht es? Zeitplan, Umfang, Links – alles, was hilft.'
      }
    },
    privacy: <>Ich habe die <Link href={"/privacy" as ComponentProps<typeof Link>['href']} target="_blank" className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800 dark:hover:text-indigo-500">Datenschutzerklärung</Link> gelesen und bin mit der Verarbeitung meiner Daten einverstanden.</>,
    submit: 'Nachricht senden',
    successMessage: 'Danke — Ihre Nachricht wurde gesendet. Wir melden uns bald bei Ihnen.'
  }
}

export default content
