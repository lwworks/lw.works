import {FC} from 'react'
import {Divider} from '../atoms/divider'
import {Heading} from '../atoms/heading'
import {IconBox} from '../atoms/icon-box'
import {Section} from '../layout/section'
import {IconName} from '../icons'
import {Paragraph} from '../atoms/paragraph'

type Content = {
  targets: {icon: string; heading: string; text: string}[]
}

export const Targets: FC<{content: Content}> = ({content}) => {
  return (
    <>
      <Divider />
      <Section className="pt-16 sm:pt-24 lg:pt-40">
        <div className="grid grid-cols-1 gap-y-8 md:gap-y-12 gap-x-16 md:grid-cols-2 lg:grid-cols-3">
          {content.targets.map(({icon, heading, text}, index) => (
            <div key={index}>
              <div className="mb-4 flex flex-col gap-6 sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row">
                <IconBox icon={icon as IconName} />
                <Heading level={3} size="sm" html={heading} />
              </div>
              <Paragraph className="max-w-md">{text}</Paragraph>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
