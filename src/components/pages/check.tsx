import { CheckHeroSection } from "@/components/sections/check/hero"
import { CheckProcessSection } from "@/components/sections/check/process"
import { CheckTeamContactSection } from "@/components/sections/check/team-contact"
import { CalendarBookingSection } from "@/components/sections/contact/calendar-booking"
import { FaqSection } from "@/components/sections/faq"
import { lukas } from "@/content/team/lukas"
import { bookingConfigs, bookingMessages } from "@/lib/booking-configs"
import Link from "next/link"
import { BookingSection } from "../sections/check/booking"

const bookingSection = {
  title: 'Gespräch vereinbaren',
  description: "Such Dir einen Termin für ein kurzes Gespräch aus, damit ich mich auf Deinen Prozess-Check vorbereiten kann.",
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
      <CheckProcessSection />
      <CheckTeamContactSection />
      <BookingSection heading="Gespräch vereinbaren" description="Such Dir einen Termin für ein kurzes Gespräch aus, damit ich mich auf Deinen Prozess-Check vorbereiten kann." bookingConfig={lukas.bookingOptions.check} showMessageInput />
      <CalendarBookingSection content={bookingSection} />
      <FaqSection background="stripes" content={{
        id: 'faq',
        brow: 'FAQ',
        title: 'Häufige Fragen zum Prozess-Check',
        items: [
          {
            question: 'Wozu dient der Prozess-Check?',
            answer: ['Im Prozess-Check analysieren wir gemeinsam Deine Prozesse und Systeme – in einer Stunde geht das natürlich nicht ganzheitlich, aber sie reicht, um Dir drei Hebel an die Hand zu geben, mit denen Du Abläufe vereinfachen oder automatisieren kannst, um Zeit, Geld und Nerven zu sparen.'],
          },
          {
            question: 'Ist der Prozess-Check wirklich kostenlos?',
            answer: ['Ja, zu 100% – ohne Kleingedrucktes. Der Prozess-Check ist kostenlos, weil er ein Win-Win ist: Ich lerne Dich und Dein Unternehmen kennen, und Du erhältst 3 konkrete Hebel schwarz auf weiß, mit denen Du Zeit und Geld sparen kannst. Diese kannst Du dann mit oder ohne uns umsetzen.'],
          },
          {
            question: 'Warum muss ich zuerst ein 15-Min-Gespräch buchen?',
            answer: ['Das 15-Min-Gespräch hilft mir dabei, mich auf Deinen Prozess-Check vorzubereiten. Dabei finden wir auch heraus, ob sich ein Prozess-Check für Dich überhaupt lohnt.']
          },
          {
            question: 'Muss ich irgendetwas vorbereiten?',
            answer: ['Nein – und das sollst Du bewusst nicht. Denn ich möchte ja sehen, wie Deine Abläufe wirklich sind – nicht, wie sie vielleicht sein könnten.']
          }
        ],
      }} />
    </main>
  )
}
