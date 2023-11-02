import {FC} from 'react'
import {Card} from '../atoms/card'
import {Heading} from '../atoms/heading'
import {Paragraph} from '../atoms/paragraph'
import {Subheading} from '../atoms/subheading'
import {Section} from '../layout/section'
import Image from 'next/image'
import {Button} from '../atoms/button'

type Content = {
  heading: string
  steps: {
    id: string
    heading: string
    text: string
  }[]
  cta: {
    primary: string
    secondary: string
  }
}

export const Process: FC<{content: Content}> = ({content}) => {
  return (
    <Section>
      <div className="sticky -top-8 pt-16 sm:pt-24 lg:pt-40 mb-16">
        <Heading level={2} size="xl">
          {content.heading}
        </Heading>
      </div>
      {content.steps.map(({id, heading, text}, index) => (
        <div key={index} className="sticky mt-16" style={{top: `${15 + index * 7}rem`}}>
          <Card className="grid grid-cols-1 gap-y-16 md:grid-cols-2">
            <div className="p-16 pr-0">
              <div className="flex items-start gap-4 mb-1">
                <Subheading>{id}</Subheading>
                <Heading level={3} size="sm" className="-mt-0.5 mb-3">
                  {heading}
                </Heading>
              </div>
              <Paragraph className="max-w-md">
                <span dangerouslySetInnerHTML={{__html: text}} />
              </Paragraph>
            </div>
            <div className="relative overflow-visible">
              <div className="absolute top-0 left-0 -bottom-32 -right-56">
                <Image src="/images/background-grid.png" alt="Background Grid" fill className="object-cover object-left-top" />
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-indigo-400 w-3/4 h-32 blur-3xl opacity-50"
                  style={{borderRadius: '50% 50%'}}
                />
              </div>
            </div>
          </Card>
        </div>
      ))}
      <div className="sticky h-96 bg-gradient-to-t from-white dark:from-[#0E1117] pb-24 flex items-end justify-center gap-x-2">
        <Button>{content.cta.primary}</Button>
        <Button secondary>{content.cta.secondary}</Button>
      </div>
    </Section>
  )
}
