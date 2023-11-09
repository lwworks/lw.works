import Image from 'next/image'
import {Heading} from '../atoms/heading'
import {Section} from '../layout/section'
import {Paragraph} from '../atoms/paragraph'
import {Author} from '../content/author'
import {FC} from 'react'

type Content = {
  heading: string
  text: string
}

export const Trust: FC<{content: Content}> = ({content}) => {
  return (
    <div className="overflow-x-hidden">
      <Section id="about" className="group pt-24 lg:pt-48 grid grid-cols-1 gap-y-24 md:grid-cols-2">
        <div className="md:pr-4 md:pb-8">
          <Heading level={2} html={content.heading} />
          <Paragraph className="mt-7 max-w-lg" html={content.text} />
          <div className="mt-8">
            <Author
              name="Lukas Wiesehan"
              description="Designer & Developer"
              avatar="/images/avatars/lukas-wiesehan.jpg"
              linkedin="https://www.linkedin.com/in/lukas-wiesehan-74931b1bb/"
              twitter="https://twitter.com/lukaswiesehan"
            />
          </div>
        </div>
        <div className="relative flex flex-col justify-end">
          <div className="absolute -inset-x-24 bottom-0 overflow-hidden">
            <div
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-indigo-400 w-3/4 h-1/2 blur-3xl transition-opacity duration-500 opacity-50 group-hover:opacity-80"
              style={{borderRadius: '50% 50%'}}
            />
            <Image src="/images/background-grid.png" alt="Background Grid" width={1920} height={1080} className="w-full opacity-50" />
          </div>
          <Image
            src="/images/projects/urlbox-contentlayer-light.png"
            alt="Urlbox & Contentlayer Websites"
            width={1200}
            height={748}
            className="dark:hidden relative w-full"
          />
          <Image
            src="/images/projects/urlbox-contentlayer-dark.png"
            alt="Urlbox & Contentlayer Websites"
            width={1200}
            height={748}
            className="hidden dark:block relative w-full"
          />
        </div>
      </Section>
    </div>
  )
}
