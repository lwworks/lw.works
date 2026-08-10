import { Link } from '@/components/link'
import { CalendarBookingSection } from '../sections/contact/calendar-booking'
import { ContactOptionsSection } from '../sections/contact/contact-options'
import { TeamMemberSection } from '../sections/contact/team-member'

const memberContent = {
  id: 'team-member',
  brow: 'Termin buchen',
  name: 'Lukas Brunkhorst',
  role: 'Geschäftsführer & Design Engineer',
  image: {
    src: '/images/lukas-brunkhorst.jpg',
    alt: 'Lukas Brunkhorst',
  },
  paragraphs: [
    'Du hast Fragen zu unseren Leistungen oder möchtest ein Projekt besprechen? Buche Dir einen kostenlosen Beratungstermin — ich melde mich persönlich bei Dir.',
  ],
}

const calendarContent = {
  title: 'Termin buchen',
  description: 'Buche Dir einen Termin mit Lukas.',
  fields: {
    name: { label: 'Dein Name', placeholder: 'Max Mustermann' },
    email: { label: 'E-Mail', placeholder: 'max@unternehmen.de' },
    message: { label: 'Nachricht (optional)', placeholder: 'Worum geht es?' },
  },
  privacy: <>Ich habe die <Link href="/privacy" target="_blank" className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800 dark:hover:text-indigo-500">Datenschutzerklärung</Link> gelesen und bin mit der Verarbeitung meiner Daten einverstanden.</>,
  submit: 'Termin buchen',
  successMessage: 'Dein Termin wurde gebucht! Du erhältst eine Bestätigung per E-Mail.',
  noSlotsMessage: 'An diesem Tag sind keine Termine verfügbar.',
  errorMessages: {
    default: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.',
    botDetected: 'Anfrage wurde als automatisiert erkannt.',
    slotTaken: 'Dieser Termin ist leider nicht mehr verfügbar. Bitte wähle einen anderen.',
  },
  booking: {
    calendarId: 'lukas@lw.works',
    teamMemberSlug: 'lukas',
    timezone: 'Europe/Berlin',
    slotDurationMinutes: 30,
    advanceDays: 14,
    availableDays: [1, 2, 4, 5],
    availableHours: { start: 13, end: 17 },
  },
}

export const TeamMemberPage = () => {
  return (
    <main className="pt-16">
      <TeamMemberSection content={memberContent} />
      <ContactOptionsSection />
      <CalendarBookingSection content={calendarContent} />
    </main>
  )
}

export const teamMemberBookingConfig = calendarContent.booking
export const teamMemberCalendarMessages = {
  errorMessages: calendarContent.errorMessages,
  successMessage: calendarContent.successMessage,
}
