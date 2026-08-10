import { Link } from '@/components/link'
import { bookingConfigs, bookingMessages } from '@/lib/booking-configs'
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
  successMessage: bookingMessages.successMessage,
  noSlotsMessage: 'An diesem Tag sind keine Termine verfügbar.',
  errorMessages: bookingMessages.errorMessages,
  booking: bookingConfigs.lukas,
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

export const teamMemberBookingConfig = bookingConfigs.lukas
export const teamMemberCalendarMessages = bookingMessages

