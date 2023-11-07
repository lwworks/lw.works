import {FC} from 'react'
import {Heading} from '../atoms/heading'
import {Section} from '../layout/section'
import {Paragraph} from '../atoms/paragraph'
import {IconBox} from '../atoms/icon-box'
import {IconName} from '../icons'

type Content = {
  heading: string
  text: string
  categories: {icon: string; heading: string; text: string}[]
}

export const Design: FC<{content: Content}> = ({content}) => {
  return (
    <Section className="pt-16 sm:pt-24 lg:pt-48 pb-24">
      <Heading level={2} html={content.heading} />
      <Paragraph className="mt-7 mb-16 max-w-xl" html={content.text} />
      <div className="grid grid-cols-1 gap-y-8 md:gap-y-12 gap-x-16 md:grid-cols-2 lg:grid-cols-3">
        {content.categories.map(({icon, heading, text}, index) => (
          <div key={index}>
            <div className="mb-4 flex flex-col gap-6 sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row">
              <IconBox icon={icon as IconName} />
              <Heading level={3} size="sm" html={heading} />
            </div>
            <Paragraph className="max-w-md" html={text} />
          </div>
        ))}
      </div>
    </Section>
  )
}
