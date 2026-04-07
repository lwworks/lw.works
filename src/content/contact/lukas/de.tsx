import type { TeamMemberPageContent } from '@/components/pages/team-member'
import { Link } from '@/i18n/link'
import type { ComponentProps } from 'react'

const content: TeamMemberPageContent = {
  metadata: {
    title: 'Termin buchen mit Lukas Brunkhorst — LW Works GmbH',
    description: 'Buche einen unverbindlichen Beratungstermin mit Lukas Brunkhorst, Geschäftsführer & Design Engineer bei LW Works.'
  },
  member: {
    id: 'team-member',
    brow: 'Termin buchen',
    name: 'Lukas Brunkhorst',
    role: 'Geschäftsführer & Design Engineer',
    image: {
      src: '/images/lukas-brunkhorst.jpg',
      alt: 'Lukas Brunkhorst'
    },
    paragraphs: [
      'Du hast Fragen zu unseren Leistungen oder möchtest ein Projekt besprechen? Buche Dir einen kostenlosen Beratungstermin — ich melde mich persönlich bei Dir.'
    ]
  },
  calendar: {
    title: 'Termin buchen',
    description: 'Dauer: 30 Min. · Europe/Berlin',
    fields: {
      name: { label: 'Dein Name', placeholder: 'Max Mustermann' },
      email: { label: 'E-Mail', placeholder: 'max@unternehmen.de' },
      message: { label: 'Nachricht (optional)', placeholder: 'Worum geht es?' }
    },
    privacy: <>Ich habe die <Link href={'/privacy' as ComponentProps<typeof Link>['href']} target="_blank" className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800 dark:hover:text-indigo-500">Datenschutzerklärung</Link> gelesen und bin mit der Verarbeitung meiner Daten einverstanden.</>,
    submit: 'Termin buchen',
    successMessage: 'Dein Termin wurde gebucht! Du erhältst eine Bestätigung per E-Mail.',
    errorMessages: {
      default: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.',
      botDetected: 'Anfrage wurde als automatisiert erkannt.',
      slotTaken: 'Dieser Termin ist leider nicht mehr verfügbar. Bitte wähle einen anderen.'
    },
    booking: {
      calendarId: 'lukas@lw.works',
      teamMemberSlug: 'lukas',
      timezone: 'Europe/Berlin',
      slotDurationMinutes: 30,
      advanceDays: 14,
      availableDays: [1, 2, 4, 5],
      availableHours: { start: 9, end: 17 }
    }
  }
}

export default content
