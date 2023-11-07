import {FC} from 'react'
import {Divider} from '../atoms/divider'
import {Section} from '../layout/section'
import {Icon} from '../icons'
import Image from 'next/image'

type Content = {quote: string; author: string; role: string}

export const Testimonial: FC<{content: Content}> = ({content}) => {
  return (
    <>
      <Divider />
      <Section className="relative overflow-hidden pt-16 lg:pt-20 flex flex-col items-start lg:items-center gap-6">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-indigo-400 w-1/2 h-32 blur-3xl opacity-25" style={{borderRadius: '50% 50%'}} />
        <div className="flex gap-0.5 text-indigo-200 dark:text-indigo-900">
          <Icon name="star" className="h-4" />
          <Icon name="star" className="h-4" />
          <Icon name="star" className="h-4" />
          <Icon name="star" className="h-4" />
          <Icon name="star" className="h-4" />
        </div>
        <div className="text-3xl font-display italic leading-tight text-indigo-500 dark:text-indigo-400 relative lg:text-center">{`"${content.quote}"`}</div>
        <div className="flex relative items-center gap-3">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-black dark:border-white">
            <Image src="/images/avatars/johannes-schickling.jpg" alt="Johannes Schickling" fill />
          </div>
          <div>
            <p className="pt-0.5 font-semibold leading-none text-black dark:text-white">{content.author}</p>
            <p className="leading-snug text-slate-600 dark:text-slate-300">{content.role}</p>
          </div>
        </div>
      </Section>
    </>
  )
}
