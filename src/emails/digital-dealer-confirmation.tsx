import {Text} from '@react-email/components'
import {EmailLayout} from './components/layout'

type DigitalDealerConfirmationEmailProps = {
  name: string
  dealership: string
  plans: string[]
  locale: 'de' | 'en'
}

const translations = {
  de: {
    preview: (name: string) => `Danke für Ihre Anfrage, ${name}!`,
    title: 'Danke für Ihre Anfrage!',
    body: (name: string, dealership: string) =>
      `Hallo ${name}, vielen Dank für Ihr Interesse am Digital Dealer Programm für ${dealership}. Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24 Stunden bei Ihnen.`,
    plansLabel: 'Ihre gewählten Pakete',
    replyPrompt: 'Falls Sie in der Zwischenzeit Fragen haben, antworten Sie einfach auf diese E-Mail.'
  },
  en: {
    preview: (name: string) => `Thank you for your inquiry, ${name}!`,
    title: 'Thank you for your inquiry!',
    body: (name: string, dealership: string) =>
      `Hi ${name}, thank you for your interest in the Digital Dealer program for ${dealership}. We have received your inquiry and will get back to you within 24 hours.`,
    plansLabel: 'Your selected plans',
    replyPrompt: 'If you have any questions in the meantime, simply reply to this email.'
  }
}

export const DigitalDealerConfirmationEmail = ({name, dealership, plans, locale}: DigitalDealerConfirmationEmailProps) => {
  const t = translations[locale]

  return (
    <EmailLayout preview={t.preview(name)} locale={locale}>
      <Text className="text-lg font-bold text-neutral-900 m-0 mb-4">{t.title}</Text>
      <Text className="text-sm text-neutral-600 m-0 mb-7 leading-normal">{t.body(name, dealership)}</Text>

      <Text className="text-xs text-neutral-400 m-0 leading-snug">{t.plansLabel}</Text>
      <Text className="text-sm text-neutral-900 mt-0.5 mb-7 leading-normal">
        Basis{plans.length > 0 ? `, ${plans.join(', ')}` : ''}
      </Text>

      <Text className="text-sm text-neutral-600 m-0 leading-normal">{t.replyPrompt}</Text>
    </EmailLayout>
  )
}

DigitalDealerConfirmationEmail.PreviewProps = {
  name: 'Max Mustermann',
  dealership: 'Autohaus Mustermann',
  plans: ['service', 'convert'],
  locale: 'de',
} satisfies DigitalDealerConfirmationEmailProps

export default DigitalDealerConfirmationEmail
