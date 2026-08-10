import Link from "next/link"
import { CheckHeroSection } from "../sections/check/hero"
import { CalendarBookingSection } from "../sections/contact/calendar-booking"

const bookingSection = {
  title: 'Termin buchen',
  description: 'Buche Dir einen Termin mit Lukas.',
  fields: {
    name: { label: 'Dein Name', placeholder: 'Max Mustermann' },
    email: { label: 'E-Mail', placeholder: 'max@unternehmen.de' },
    message: { label: 'Nachricht (optional)', placeholder: 'Worum geht es?' },
  },
  privacy: <>Ich habe die <Link href="/privacy" target="_blank" className="text-black dark:text-white underline hover:text-black/80 dark:hover:white/80">Datenschutzerklärung</Link> gelesen und bin mit der Verarbeitung meiner Daten einverstanden.</>,
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
    slotDurationMinutes: 15,
    advanceDays: 14,
    availableDays: [1, 2, 4, 5],
    availableHours: { start: 13, end: 17 },
  },
}

export const CheckPage = () => {
  return (
    <main className="pt-16">
      <CheckHeroSection />
      <CalendarBookingSection content={bookingSection} />
    </main>
  )
}
