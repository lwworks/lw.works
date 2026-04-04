import {Text} from '@react-email/components'
import {EmailLayout} from './components/layout'

type DigitalDealerLeadEmailProps = {
  name: string
  dealership: string
  email: string
  phone?: string
  plans: string[]
}

export const DigitalDealerLeadEmail = ({name, dealership, email, phone, plans}: DigitalDealerLeadEmailProps) => {
  return (
    <EmailLayout preview={`Neue Anfrage von ${name} (${dealership})`}>
      <Text className="text-lg font-bold text-neutral-900 m-0 mb-7">Digital Dealer Anfrage</Text>

      <Text className="text-xs text-neutral-400 m-0 leading-snug">Name</Text>
      <Text className="text-sm text-neutral-900 mt-0.5 mb-5 leading-normal">{name}</Text>

      <Text className="text-xs text-neutral-400 m-0 leading-snug">Autohaus</Text>
      <Text className="text-sm text-neutral-900 mt-0.5 mb-5 leading-normal">{dealership}</Text>

      <Text className="text-xs text-neutral-400 m-0 leading-snug">E-Mail</Text>
      <Text className="text-sm text-neutral-900 mt-0.5 mb-5 leading-normal">{email}</Text>

      {phone && (
        <>
          <Text className="text-xs text-neutral-400 m-0 leading-snug">Telefon</Text>
          <Text className="text-sm text-neutral-900 mt-0.5 mb-5 leading-normal">{phone}</Text>
        </>
      )}

      <Text className="text-xs text-neutral-400 m-0 leading-snug">Gewählte Pakete</Text>
      <Text className="text-sm text-neutral-900 mt-0.5 mb-0 leading-normal">{plans.length > 0 ? plans.join(', ') : 'Nur Basis'}</Text>
    </EmailLayout>
  )
}

DigitalDealerLeadEmail.PreviewProps = {
  name: 'Max Mustermann',
  dealership: 'Autohaus Mustermann',
  email: 'max@mustermann.de',
  phone: '0170 1234567',
  plans: ['service', 'convert'],
} satisfies DigitalDealerLeadEmailProps

export default DigitalDealerLeadEmail
