import { Link, Text } from '@react-email/components'
import { DetailRow } from './components/detail-row'
import { EmailLayout } from './components/layout'

type BookingConfirmationEmailProps = {
  eventName: string
  name: string
  teamMember: string
  date: string
  time: string
  type: 'online' | 'phone'
  phone?: string
  meetUrl?: string
  message?: string
}

export const BookingConfirmationEmail = ({ eventName, name, teamMember, date, time, type, phone, meetUrl, message }: BookingConfirmationEmailProps) => {
  return (
    <EmailLayout preview={`${name}, Dein Termin ist bestätigt!`}>
      <Text className="text-lg font-bold text-neutral-900 m-0 mb-4">Dein Termin ist bestätigt!</Text>
      <Text className="text-sm text-neutral-600 m-0 mb-2 leading-normal">{`Moin ${name},`}</Text>
      <Text className="text-sm text-neutral-600 m-0 mb-4 leading-normal">{`Dein ${eventName} ist bestätigt. Du erhältst eine gesonderte Kalendereinladung per E-Mail – bitte bestätige den Termin dort.`}</Text>
      <DetailRow iconSrc={`${process.env.EMAIL_ASSET_BASE}/calendar-icon.png`}>
        {`${date} um ${time} Uhr`}
      </DetailRow>
      <DetailRow iconSrc={`${process.env.EMAIL_ASSET_BASE}/user-circle-icon.png`}>
        {`Mit ${teamMember}`}
      </DetailRow>
      {type === 'online' ? (
        <DetailRow iconSrc={`${process.env.EMAIL_ASSET_BASE}/camera-icon.png`}>
          <Link href={meetUrl} className="text-sm text-neutral-600 underline">
            Google Meet
          </Link>
        </DetailRow>
      ) : (
        <DetailRow iconSrc={`${process.env.EMAIL_ASSET_BASE}/telephone-icon.png`}>
          {`Am Telefon (${phone})`}
        </DetailRow>
      )}
      {message && (
        <>
          <Text className="font-bold text-neutral-900 m-0 mt-4 mb-2">Deine Nachricht:</Text>
          <Text className="text-sm text-neutral-600 italic m-0 leading-normal">{message}</Text>
        </>
      )}
      <Text className="text-sm text-neutral-600 m-0 mt-4 leading-normal">
        Falls du den Termin absagen oder verschieben musst, antworte bitte einfach auf diese E-Mail.
      </Text>
    </EmailLayout>
  )
}

BookingConfirmationEmail.PreviewProps = {
  eventName: 'Prozess-Check',
  name: 'Max Mustermann',
  teamMember: 'Lukas Brunkhorst',
  date: '15. April 2026',
  time: '14:30',
  type: 'phone',
  phone: '+49 123 456 789',
  meetUrl: 'https://meet.google.com/abc-defg-hij',
  message: 'Ich möchte ein neues Projekt starten',
} satisfies BookingConfirmationEmailProps

export default BookingConfirmationEmail
