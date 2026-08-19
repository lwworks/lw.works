import { Column, Img, Row, Text } from '@react-email/components'

interface DetailRowProps {
  iconSrc: string
  children: React.ReactNode
}

export const DetailRow = ({ iconSrc, children }: DetailRowProps) => (
  <Row className="mb-3">
    <Column className="w-5 align-top pr-3">
      <Img src={iconSrc} width="16" height="16" alt="" />
    </Column>
    <Column className="align-top">
      <Text className="text-sm text-neutral-600 m-0 leading-normal">{children}</Text>
    </Column>
  </Row>
)