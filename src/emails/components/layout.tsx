import {Body, Column, Head, Hr, Html, Img, Link, Preview, Row, Section, Tailwind, Text} from '@react-email/components'

type EmailLayoutProps = {
  preview: string
  locale?: 'de' | 'en'
  children: React.ReactNode
}

const footerTranslations = {
  de: {privacy: 'Datenschutz'},
  en: {privacy: 'Privacy'}
}

export const EmailLayout = ({preview, locale = 'de', children}: EmailLayoutProps) => {
  const t = footerTranslations[locale]
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>{preview}</Preview>
        <Body className="bg-white font-sans m-0 p-0">
          <Section className="w-full border-0">
            {/* Logo */}
            <Row>
              <Column className="min-w-[24px]" />
              <Column className="w-[480px] border-l border-r border-neutral-200">
                <Section className="py-7 px-10">
                  <Img src="https://2026.lw.works/images/logo-black.png" width="43" height="24" alt="LW Works" />
                </Section>
              </Column>
              <Column className="min-w-[24px]" />
            </Row>
            <Hr className="border-neutral-200 m-0" />
            {/* Content */}
            <Row>
              <Column className="min-w-[24px]" />
              <Column className="w-[480px] border-l border-r border-neutral-200">
                <Section className="py-8 px-10">{children}</Section>
              </Column>
              <Column className="min-w-[24px]" />
            </Row>
            <Hr className="border-neutral-200 m-0" />
            {/* Footer */}
            <Row>
              <Column className="min-w-[24px] border-b border-neutral-200" />
              <Column className="w-[480px] border-l border-r border-b border-neutral-200">
                <Row className="py-5 px-10">
                  <Column className="align-middle">
                    <Text className="text-xs text-neutral-400 m-0">&copy; LW Works GmbH 2026</Text>
                  </Column>
                  <Column className="text-right align-middle">
                    <Link href="https://lw.works/impressum" className="text-xs text-neutral-400 no-underline hover:underline">
                      Impressum
                    </Link>
                    <span className="text-xs text-neutral-300 mx-1.5"></span>
                    <Link href="https://lw.works/privacy" className="text-xs text-neutral-400 no-underline hover:underline">
                      {t.privacy}
                    </Link>
                  </Column>
                </Row>
              </Column>
              <Column className="min-w-[24px] border-b border-neutral-200" />
            </Row>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}
