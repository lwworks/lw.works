'use client'

import {allProjects} from 'contentlayer/generated'
import {Project} from '../content/project'
import {FC, useState} from 'react'
import {Locale} from '@/i18n.config'
import {motion, AnimatePresence} from 'framer-motion'
import {Icon} from '../icons'

export const AllProjects: FC<{language: Locale}> = ({language}) => {
  const projects = allProjects.filter((post) => post.language === language).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const [[index, direction], setIndex] = useState<number[]>([0, 0])
  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? '100%' : -'100%',
        opacity: 0
      }
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? '100%' : -'100%',
        opacity: 0
      }
    }
  }

  return (
    <div className="relative">
      <Project project={projects[index]} reverse={true} hideLink={true}>
        <div className="flex gap-2 mt-8">
          <button
            onClick={() => setIndex(() => [index === 0 ? projects.length - 1 : index - 1, -1])}
            className="relative h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-b from-slate-100 to-slate-200 dark:from-[#393C45] dark:to-[#1A1D24] p-px shadow shadow-black/5 focus:outline-none focus:ring-1 focus:ring-white/20"
          >
            <div className="flex h-full w-full justify-center items-center rounded-full bg-[#F9FAFB] text-slate-800 hover:bg-white dark:bg-[#171C23] dark:text-slate-50 dark:hover:bg-[#1E242B] font-bold">
              <Icon name="chevron-down" className="rotate-90 h-3" />
            </div>
          </button>
          <button
            onClick={() => setIndex(() => [index === projects.length - 1 ? 0 : index + 1, 1])}
            className="relative h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-b from-slate-100 to-slate-200 dark:from-[#393C45] dark:to-[#1A1D24] p-px shadow shadow-black/5 focus:outline-none focus:ring-1 focus:ring-white/20"
          >
            <div className="flex h-full w-full justify-center items-center rounded-full bg-[#F9FAFB] text-slate-800 hover:bg-white dark:bg-[#171C23] dark:text-slate-50 dark:hover:bg-[#1E242B] font-bold">
              <Icon name="chevron-down" className="-rotate-90 h-3" />
            </div>
          </button>
        </div>
      </Project>
    </div>
  )
}
