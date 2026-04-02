import { Body, Column, Head, Hr, Html, Img, Preview, Row, Section, Tailwind, Text } from '@react-email/components'

type DigitalDealerLeadEmailProps = {
  name: string
  dealership: string
  email: string
  phone?: string
  plans: string[]
}

export const DigitalDealerLeadEmail = ({ name, dealership, email, phone, plans }: DigitalDealerLeadEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Neue Anfrage von {name} ({dealership})</Preview>
      <Tailwind>
        <Body className="bg-white font-sans m-0 py-10">
          <Section className="w-full border-0">
            {/* Logo */}
            <Row>
              <Column />
              <Column className="w-[480px] border-l border-r border-neutral-200">
                <Section className="py-7 px-10">
                  <Img
                    src="https://lw.works/images/logo-black.png"
                    width="43"
                    height="24"
                    alt="LW Works"
                  />
                </Section>
              </Column>
              <Column />
            </Row>

            <Hr className="border-neutral-200 m-0" />

            {/* Content */}
            <Row>
              <Column />
              <Column className="w-[480px] border-l border-r border-neutral-200">
                <Section className="py-8 px-10">
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
                </Section>
              </Column>
              <Column />
            </Row>

            <Hr className="border-neutral-200 m-0" />

            {/* Footer */}
            <Row>
              <Column />
              <Column className="w-[480px] border-l border-r border-neutral-200">
                <Section className="py-5 px-10">
                  <Text className="text-xs text-neutral-400 m-0">&copy; LW Works</Text>
                </Section>
              </Column>
              <Column />
            </Row>
          </Section>
        </Body>
      </Tailwind>
    </Html>
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
