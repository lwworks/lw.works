import { Text } from '@react-email/components'
import { EmailLayout } from './components/layout'

type BookingConfirmationEmailProps = {
  visitorName: string
  memberName: string
  dateTime: string
  locale: 'de' | 'en'
}

const translations = {
  de: {
    preview: (name: string) => `Dein Termin ist bestätigt, ${name}!`,
    title: 'Dein Termin ist bestätigt!',
    body: (visitorName: string, memberName: string, dateTime: string) =>
      `Hallo ${visitorName}, dein Termin mit ${memberName} am ${dateTime} ist bestätigt. Du erhältst eine Kalendereinladung per E-Mail.`,
    replyPrompt: 'Falls du den Termin absagen oder verschieben musst, antworte einfach auf diese E-Mail.'
  },
  en: {
    preview: (name: string) => `Your call is confirmed, ${name}!`,
    title: 'Your call is confirmed!',
    body: (visitorName: string, memberName: string, dateTime: string) =>
      `Hi ${visitorName}, your consultation with ${memberName} on ${dateTime} is confirmed. You'll receive a calendar invite via email.`,
    replyPrompt: 'If you need to cancel or reschedule, simply reply to this email.'
  }
}

export const BookingConfirmationEmail = ({ visitorName, memberName, dateTime, locale }: BookingConfirmationEmailProps) => {
  const t = translations[locale]

  return (
    <EmailLayout preview={t.preview(visitorName)} locale={locale}>
      <Text className="text-lg font-bold text-neutral-900 m-0 mb-4">{t.title}</Text>
      <Text className="text-sm text-neutral-600 m-0 mb-7 leading-normal">{t.body(visitorName, memberName, dateTime)}</Text>
      <Text className="text-sm text-neutral-600 m-0 leading-normal">{t.replyPrompt}</Text>
    </EmailLayout>
  )
}

BookingConfirmationEmail.PreviewProps = {
  visitorName: 'Max Mustermann',
  memberName: 'Lukas Brunkhorst',
  dateTime: '15. April 2026, 10:00',
  locale: 'de'
} satisfies BookingConfirmationEmailProps

export default BookingConfirmationEmail
