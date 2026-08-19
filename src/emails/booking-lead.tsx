import { Text } from '@react-email/components'
import { EmailLayout } from './components/layout'

type BookingLeadEmailProps = {
  eventName: string
  name: string
  email: string
  phone?: string
  date: string
  time: string
  type: 'online' | 'phone'
  message?: string
}

export const BookingLeadEmail = ({
  eventName,
  name,
  email,
  phone,
  date,
  time,
  type,
  message,
}: BookingLeadEmailProps) => {
  return (
    <EmailLayout preview={`Neue Terminbuchung von ${name}`}>
      <Text className="text-lg font-bold text-neutral-900 m-0 mb-7">Neue {eventName}-Buchung</Text>
      <Text className="text-xs text-neutral-400 m-0 leading-snug">Name</Text>
      <Text className="text-sm text-neutral-900 mt-0.5 mb-5 leading-normal">{name}</Text>
      <Text className="text-xs text-neutral-400 m-0 leading-snug">E-Mail</Text>
      <Text className="text-sm text-neutral-900 mt-0.5 mb-5 leading-normal">{email}</Text>
      {phone && (
        <>
          <Text className="text-xs text-neutral-400 m-0 leading-snug">Telefon</Text>
          <Text className="text-sm text-neutral-900 mt-0.5 mb-5 leading-normal">{phone}</Text>
        </>
      )}
      <Text className="text-xs text-neutral-400 m-0 leading-snug">Termin</Text>
      <Text className="text-sm text-neutral-900 mt-0.5 mb-5 leading-normal">{date} um {time} Uhr</Text>
      {type && (
        <>
          <Text className="text-xs text-neutral-400 m-0 leading-snug">Art</Text>
          <Text className="text-sm text-neutral-900 mt-0.5 mb-5 leading-normal">{type === 'online' ? 'Google Meet' : 'Telefonat'}</Text>
        </>
      )}
      {message && (
        <>
          <Text className="text-xs text-neutral-400 m-0 leading-snug">Nachricht</Text>
          <Text className="text-sm text-neutral-900 mt-0.5 mb-5 leading-normal">{message}</Text>
        </>
      )}
    </EmailLayout>
  )
}

BookingLeadEmail.PreviewProps = {
  eventName: 'Prozess-Check',
  name: 'Max Mustermann',
  email: 'max@unternehmen.de',
  phone: '+49 170 1234567',
  date: '15. April 2026',
  time: '10:00',
  type: 'phone',
  message: 'Ich interessiere mich für das Digital Dealer Paket.',
} satisfies BookingLeadEmailProps

export default BookingLeadEmail
