import {FC} from 'react'
import {Divider} from '../atoms/divider'
import {Heading} from '../atoms/heading'
import {IconBox} from '../atoms/icon-box'
import {Section} from '../layout/section'
import {IconName} from '../icons'
import {Paragraph} from '../atoms/paragraph'

export const Features: FC<{}> = ({}) => {
  return (
    <>
      <Divider />
      <Section className="pt-16 sm:pt-24 lg:pt-36">
        <div className="grid grid-cols-1 gap-y-8 md:gap-y-12 gap-x-16 md:grid-cols-2 lg:grid-cols-3">Features</div>
      </Section>
    </>
  )
}
