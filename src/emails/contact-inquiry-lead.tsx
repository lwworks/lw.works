import {Text} from '@react-email/components'
import {EmailLayout} from './components/layout'

type ContactInquiryLeadEmailProps = {
  name: string
  email: string
  message: string
}

export const ContactInquiryLeadEmail = ({name, email, message}: ContactInquiryLeadEmailProps) => {
  return (
    <EmailLayout preview={`Kontaktanfrage von ${name}`}>
      <Text className="text-lg font-bold text-neutral-900 m-0 mb-7">Kontaktanfrage (lw.works)</Text>

      <Text className="text-xs text-neutral-400 m-0 leading-snug">Name</Text>
      <Text className="text-sm text-neutral-900 mt-0.5 mb-5 leading-normal">{name}</Text>

      <Text className="text-xs text-neutral-400 m-0 leading-snug">E-Mail</Text>
      <Text className="text-sm text-neutral-900 mt-0.5 mb-5 leading-normal">{email}</Text>

      <Text className="text-xs text-neutral-400 m-0 leading-snug">Nachricht</Text>
      <Text className="text-sm text-neutral-900 mt-0.5 mb-0 leading-normal whitespace-pre-wrap">{message}</Text>
    </EmailLayout>
  )
}

ContactInquiryLeadEmail.PreviewProps = {
  name: 'Alex Beispiel',
  email: 'alex@beispiel.de',
  message: 'Wir planen ein neues Webprojekt und würden uns über ein Erstgespräch freuen.',
} satisfies ContactInquiryLeadEmailProps

export default ContactInquiryLeadEmail
