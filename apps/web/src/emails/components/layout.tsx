import { Body, Column, Head, Hr, Html, Img, Link, Preview, Row, Section, Tailwind, Text } from '@react-email/components'

type EmailLayoutProps = {
  preview: string
  children: React.ReactNode
}

export const EmailLayout = ({ preview, children }: EmailLayoutProps) => {
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
                  <Img src={`${process.env.EMAIL_ASSET_BASE}/logo-black.png`} width="43" height="24" alt="LW Works" />
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
                    <Link href="https://www.lw.works/impressum" className="text-xs text-neutral-400 no-underline hover:underline">
                      Impressum
                    </Link>
                    <span className="text-xs text-neutral-300 mx-1.5"></span>
                    <Link href="https://www.lw.works/datenschutz" className="text-xs text-neutral-400 no-underline hover:underline">
                      Datenschutz
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
