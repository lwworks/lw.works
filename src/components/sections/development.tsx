import {FC} from 'react'
import {Heading} from '../atoms/heading'
import {Section} from '../layout/section'
import {Paragraph} from '../atoms/paragraph'
import Image from 'next/image'
import {Divider} from '../atoms/divider'

type Content = {
  heading: string
  text: string
}

const logos = [
  {src: '/images/logos/next.svg', alt: 'Next.js', height: 24, width: 118, scale: 0.8},
  {src: '/images/logos/radix.svg', alt: 'Framer Motion', height: 24, width: 76},
  {src: '/images/logos/framer-motion.svg', alt: 'Framer Motion', height: 24, width: 93},
  {src: '/images/logos/tailwind.svg', alt: 'TailwindCSS', height: 24, width: 190, scale: 0.9},
  {src: '/images/logos/headlessui.svg', alt: 'Headless UI', height: 24, width: 138}
]

export const Development: FC<{content: Content}> = ({content}) => {
  return (
    <>
      <Divider />
      <Section className="pt-16 lg:pt-24">
        <Heading level={2} html={content.heading} />
        <Paragraph className="mt-7 mb-12 lg:mb-16 max-w-xl" html={content.text} />
        <div className="col-span-2 flex flex-col items-center sm:flex-row flex-wrap justify-between sm:-ml-3 gap-x-16 gap-y-8">
          {logos.map(({src, alt, width, height, scale}, index) => (
            <div key={index} className="relative" style={{scale}}>
              <Image src={src.replace('.svg', '-black.svg')} alt={alt} width={width} height={height} className="h-8 w-auto dark:hidden" />
              <Image src={src.replace('.svg', '-white.svg')} alt={alt} width={width} height={height} className="h-8 w-auto hidden dark:block" />
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
