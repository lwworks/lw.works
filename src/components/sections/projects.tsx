'use client'

import Image from 'next/image'
import {Heading} from '../atoms/heading'
import {Section} from '../layout/section'
import {Paragraph} from '../atoms/paragraph'
import {FC, useState} from 'react'
import {Button} from '../atoms/button'
import {Locale} from '@/i18n.config'
import {AllProjects} from './all-projects'
import {AnimatePresence, motion} from 'framer-motion'

type Content = {
  heading: string
  text: string
  showMore: string
  showLess: string
}

export const Projects: FC<{content: Content; language: Locale}> = ({content, language}) => {
  const [showMore, setShowMore] = useState<boolean>(false)

  return (
    <>
      <Section id="work" className="relative group pt-24 lg:pt-48 grid grid-cols-1 gap-y-16 md:grid-cols-3 items-end">
        <div className="absolute bottom-0 h-96 inset-x-0">
          <div
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-indigo-400 w-1/2 h-32 blur-3xl sm:blur-4xl transition-opacity duration-500 opacity-70 group-hover:opacity-90"
            style={{borderRadius: '50% 50%'}}
          />
          <Image
            src="/images/background-grid.png"
            alt="Background Grid"
            width={1920}
            height={1080}
            className="h-full w-auto mx-auto opacity-50 pointer-events-none"
          />
        </div>
        <div className="hidden md:block">
          <Image src="/images/projects/clearyst-light.png" alt="Clearyst Website" width={1200} height={748} className="dark:hidden relative w-full" />
          <Image src="/images/projects/clearyst-dark.png" alt="Clearyst Website" width={1200} height={748} className="hidden dark:block relative w-full" />
        </div>
        <div className="relative flex flex-col items-start md:items-center justify-end md:pb-16 lg:pb-24">
          <Heading level={2} size="xl" className="md:text-center" html={content.heading} />
          <Paragraph className="mt-7 mb-8 max-w-xs md:text-center">{content.text}</Paragraph>
          <Button action={() => setShowMore((show) => !show)}>{showMore ? content.showLess : content.showMore}</Button>
        </div>
        <div>
          <Image src="/images/projects/effect-light.png" alt="Clearyst Website" width={1200} height={748} className="dark:hidden relative w-full" />
          <Image src="/images/projects/effect-dark.png" alt="Clearyst Website" width={1200} height={748} className="hidden dark:block relative w-full" />
        </div>
      </Section>
      <AnimatePresence>
        {showMore && (
          <motion.div initial={{height: 0}} animate={{height: 'auto'}} exit={{height: 0}} className="overflow-hidden">
            <AllProjects language={language} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
