import {FC} from 'react'
import {Card} from '../atoms/card'
import {Heading} from '../atoms/heading'
import {Paragraph} from '../atoms/paragraph'
import {Subheading} from '../atoms/subheading'
import {Section} from '../layout/section'
import Image from 'next/image'
import {RequestAnimation} from '../animation/process/request'
import {DesignDevAnimation} from '../animation/process/design-dev'
import {EvolutionAnimation} from '../animation/process/evolution'

type Content = {
  heading: string
  steps: {
    id: string
    heading: string
    text: string
  }[]
}

export const Process: FC<{content: Content}> = ({content}) => {
  return (
    <Section id="process">
      <div className="lg:sticky lg:-top-8 pt-24 lg:pt-48 mb-12 lg:mb-16">
        <Heading level={2} size="xl" className="lg:text-center">
          {content.heading}
        </Heading>
      </div>
      {content.steps.map(({id, heading, text}, index) => (
        <div
          key={index}
          className="lg:sticky"
          style={{
            top: `${17 + index * 6}rem`,
            marginBottom: `${(content.steps.length - index - 1) * 6}rem`,
            marginTop: index > 0 ? `-${(content.steps.length - index) * 6 - 3}rem` : 0
          }}
        >
          <div className="hidden lg:block absolute -top-16 h-32 w-full bg-gradient-to-t from-white via-white/80 dark:from-[#0E1117] dark:via-[#0E1117]" />
          <Card className="grid grid-cols-1 lg:grid-cols-2">
            <div className="px-6 py-8 lg:p-16 lg:pr-0">
              <div className="flex flex-col lg:flex-row items-start gap-x-4 gap-y-2 mb-1">
                <Subheading>{id}</Subheading>
                <Heading level={3} size="sm" className="-mt-0.5 mb-3">
                  {heading}
                </Heading>
              </div>
              <Paragraph className="max-w-md" html={text} />
            </div>
            <div className="hidden sm:block relative overflow-hidden">
              <div className="absolute h-2/3 left-0 bottom-0 -right-64">
                <Image src="/images/background-grid.png" alt="Background Grid" fill className="object-cover object-left-top opacity-50" />
                <div
                  className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-indigo-400 w-3/4 h-32 blur-3xl opacity-30"
                  style={{borderRadius: '50% 50%'}}
                />
              </div>
              {index === 0 && <RequestAnimation />}
              {index === 1 && <DesignDevAnimation />}
              {index === 2 && <EvolutionAnimation />}
            </div>
          </Card>
        </div>
      ))}
    </Section>
  )
}
