'use client'
import {motion} from 'framer-motion'
import {FC, useEffect, useState} from 'react'
import {ArrowIcon} from '@/components/icons/arrow'

export const TOC: FC<{headings: PostHeading[]}> = ({headings}) => {
  const [activeHeadingId, setActiveHeadingId] = useState<number>(0)
  const [arrowOffsetTop, setArrowOffsetTop] = useState<number>(0)

  useEffect(() => {
    const handleScroll = () => {
      for (let id = 0; id < headings.length; id++) {
        const element = document.getElementById(headings[id].slug)
        if (element && element.getBoundingClientRect().top < 240) setActiveHeadingId(id)
      }
    }
    window.addEventListener('scroll', handleScroll, {passive: true})
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  useEffect(() => {
    const tocElement = document.getElementById(`toc--${headings[activeHeadingId].slug}`)!
    setArrowOffsetTop(tocElement.offsetTop) // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHeadingId])

  const scrollTo = (id: string) => {
    const pos = document.getElementById(id)!.getBoundingClientRect().top + window.pageYOffset || 128
    window.scrollTo({top: pos - 128, behavior: 'smooth'})
  }

  return (
    <div className="text-slate-600 dark:text-slate-300 ">
      <h4 className="mb-2 font-semibold text-black dark:text-white">Auf dieser Seite</h4>
      <ul className="relative space-y-2 pl-6">
        <motion.div className="absolute left-0 flex h-6 items-center" animate={{top: arrowOffsetTop - 1}} transition={{duration: 0.2}}>
          <ArrowIcon className="w-4 text-indigo-500" />
        </motion.div>
        {headings.map(({level, heading, slug}: PostHeading, index: number) => (
          <li key={index} style={{paddingLeft: `${(level - 2) * 1}rem`}}>
            <button
              onClick={() => scrollTo(slug)}
              id={`toc--${slug}`}
              className={`text-left leading-snug ${
                activeHeadingId === index ? 'text-indigo-500 dark:text-indigo-400' : 'hover:text-black dark:hover:text-white'
              }`}
            >
              {heading}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
