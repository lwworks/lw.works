import { Main } from "@/components/main"
import { BookingSection } from "@/components/sections/booking"
import { CheckHeroSection } from "@/components/sections/check/hero"
import { CheckProcessSection } from "@/components/sections/check/process"
import { CheckTeamContactSection } from "@/components/sections/check/team-contact"
import { FaqSection } from "@/components/sections/faq"
import { lukas } from "@/content/team/lukas"

export const CheckPage = () => {
  return (
    <Main>
      <CheckHeroSection />
      <CheckProcessSection />
      <CheckTeamContactSection />
      <BookingSection
        heading="Termin vereinbaren"
        description="Such Dir einen Termin für Dein Erstgespräch aus, damit ich mich auf Deinen Prozess-Check vorbereiten kann."
        bookingConfig={lukas.bookingOptions.check}
      />
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
            question: 'Warum zunächst das Erstgespräch?',
            answer: ['Das 15-Min-Gespräch hilft mir dabei, mich auf Deinen Prozess-Check vorzubereiten. Dabei finden wir auch heraus, ob sich ein Prozess-Check für Dich überhaupt lohnt.']
          },
          {
            question: 'Muss ich irgendetwas vorbereiten?',
            answer: ['Nein – und das sollst Du bewusst nicht. Denn ich möchte ja sehen, wie Deine Abläufe wirklich sind – nicht, wie sie vielleicht sein könnten.']
          }
        ],
      }} />
    </Main>
  )
}
