import {FC} from 'react'
import {Divider} from '../atoms/divider'
import {Heading} from '../atoms/heading'
import {IconBox} from '../atoms/icon-box'
import {Section} from '../layout/section'
import {IconName} from '../icons'
import {Paragraph} from '../atoms/paragraph'

type Content = {
  painPoints: {icon: string; heading: string; text: string}[]
}

export const PainPoints: FC<{content: Content}> = ({content}) => {
  return (
    <>
      <Divider />
      <Section className="pt-16 lg:pt-24">
        <div className="grid grid-cols-1 gap-12 lg:gap-x-16 md:grid-cols-2 lg:grid-cols-3">
          {content.painPoints.map(({icon, heading, text}, index) => (
            <div key={index}>
              <div className="mb-4 flex flex-col gap-6 sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row">
                <IconBox icon={icon as IconName} color="rose" />
                <Heading level={3} size="sm" html={heading} />
              </div>
              <Paragraph className="max-w-md" html={text} />
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
