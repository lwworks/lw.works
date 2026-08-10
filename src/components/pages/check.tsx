import { bookingConfigs, bookingMessages } from "@/lib/booking-configs"
import Link from "next/link"
import { CheckHeroSection } from "../sections/check/hero"
import { CalendarBookingSection } from "../sections/contact/calendar-booking"

const bookingSection = {
  title: 'Erstgespräch buchen',
  description: "Buch' Dir kurzes Erstgespräch, damit ich mich anschließend auf Deinen Prozess-Check vorbereiten kann.",
  fields: {
    name: { label: 'Dein Name', placeholder: 'Max Mustermann' },
    email: { label: 'E-Mail', placeholder: 'max@unternehmen.de' },
    meetingType: {
      label: 'Terminart',
      online: { label: 'Online-Meeting', value: 'online' as const },
      phone: { label: 'Telefonat', value: 'phone' as const },
      phoneField: {
        label: 'Telefonnummer',
        placeholder: '+49 170 1234567',
      },
    },
  },
  privacy: <>Ich habe die <Link href="/privacy" target="_blank" className="text-black dark:text-white underline hover:text-black/80 dark:hover:white/80">Datenschutzerklärung</Link> gelesen und bin mit der Verarbeitung meiner Daten einverstanden.</>,
  submit: 'Termin buchen',
  successMessage: bookingMessages.successMessage,
  noSlotsMessage: 'An diesem Tag sind keine Termine verfügbar.',
  errorMessages: bookingMessages.errorMessages,
  booking: bookingConfigs.check,
  showTimezone: false,
}

export const CheckPage = () => {
  return (
    <main className="pt-16">
      <CheckHeroSection />
      <CalendarBookingSection content={bookingSection} />
    </main>
  )
}
