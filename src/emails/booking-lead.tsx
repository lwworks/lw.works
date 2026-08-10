import { Text } from '@react-email/components'
import { EmailLayout } from './components/layout'

type BookingLeadEmailProps = {
  visitorName: string
  visitorEmail: string
  message?: string
  meetingType?: string
  phone?: string
  dateTime: string
  memberName: string
}

export const BookingLeadEmail = ({
  visitorName,
  visitorEmail,
  message,
  meetingType,
  phone,
  dateTime,
  memberName,
}: BookingLeadEmailProps) => {
  return (
    <EmailLayout preview={`Neue Terminbuchung von ${visitorName}`}>
      <Text className="text-lg font-bold text-neutral-900 m-0 mb-7">Neue Terminbuchung</Text>

      <Text className="text-xs text-neutral-400 m-0 leading-snug">Name</Text>
      <Text className="text-sm text-neutral-900 mt-0.5 mb-5 leading-normal">{visitorName}</Text>

      <Text className="text-xs text-neutral-400 m-0 leading-snug">E-Mail</Text>
      <Text className="text-sm text-neutral-900 mt-0.5 mb-5 leading-normal">{visitorEmail}</Text>

      <Text className="text-xs text-neutral-400 m-0 leading-snug">Termin</Text>
      <Text className="text-sm text-neutral-900 mt-0.5 mb-5 leading-normal">{dateTime}</Text>

      {meetingType && (
        <>
          <Text className="text-xs text-neutral-400 m-0 leading-snug">Art</Text>
          <Text className="text-sm text-neutral-900 mt-0.5 mb-5 leading-normal">{meetingType}</Text>
        </>
      )}

      {phone && (
        <>
          <Text className="text-xs text-neutral-400 m-0 leading-snug">Telefon</Text>
          <Text className="text-sm text-neutral-900 mt-0.5 mb-5 leading-normal">{phone}</Text>
        </>
      )}

      {message && (
        <>
          <Text className="text-xs text-neutral-400 m-0 leading-snug">Nachricht</Text>
          <Text className="text-sm text-neutral-900 mt-0.5 mb-5 leading-normal">{message}</Text>
        </>
      )}

      <Text className="text-xs text-neutral-400 m-0 leading-snug">Berater</Text>
      <Text className="text-sm text-neutral-900 mt-0.5 mb-0 leading-normal">{memberName}</Text>
    </EmailLayout>
  )
}

BookingLeadEmail.PreviewProps = {
  visitorName: 'Max Mustermann',
  visitorEmail: 'max@unternehmen.de',
  message: 'Ich interessiere mich für das Digital Dealer Paket.',
  meetingType: 'Telefonat',
  phone: '+49 170 1234567',
  dateTime: '15. April 2026, 10:00',
  memberName: 'Lukas Brunkhorst'
} satisfies BookingLeadEmailProps

export default BookingLeadEmail
