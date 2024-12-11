'use client'

import {motion, useMotionValue, useScroll, useTransform} from 'framer-motion'
import Image from 'next/image'
import {useEffect, useRef, useState} from 'react'

export const EvolutionAnimation = () => {
  const container = useRef(null) //@ts-ignore
  const {scrollYProgress} = useScroll({target: container, offset: ['center end', 'end start']})
  // const scale = useTransform(scrollYProgress, [0, 0.29], [1, 1.11])
  // const x = useTransform(scrollYProgress, [0, 0.15], ['-33%', '0%'])
  // const y = useTransform(scrollYProgress, [0.12, 0.29], ['100%', '0%'])
  // const typing = useTransform(scrollYProgress, [0.2, 0.29], [0, 16])
  // const [typingProgress, setTypingProgress] = useState<number>(0)
  // const typingLine = 'New Feature Page'

  useEffect(() => {
    const clearTypingProgress = typing.on('change', (value) => setTypingProgress(Math.ceil(value)))
    return () => {
      clearTypingProgress()
    }
  }, [])

  const {scrollY} = useScroll()
  const progress = useMotionValue(0)
  const scale = useTransform(progress, [0, 1], [1, 1.11])
  const x = useTransform(progress, [0, 0.35], ['-33%', '0%'])
  const y = useTransform(progress, [0.3, 0.8], ['100%', '0%'])
  const typing = useTransform(progress, [0.5, 0.8], [0, 16])
  const [typingProgress, setTypingProgress] = useState<number>(0)
  const typingLine = 'New Feature Page'

  useEffect(() => {
    const clientHeight = window.innerHeight
    const topOffset = window.scrollY + document.getElementById('evolution-animation')!.getBoundingClientRect().top - clientHeight
    const clearScrollProgress = scrollY.on('change', (value) => {
      progress.set((value - topOffset) / clientHeight)
    })
    const clearTypingProgress = typing.on('change', (value) => setTypingProgress(Math.ceil(value)))
    return () => {
      clearScrollProgress()
      clearTypingProgress()
    }
  }, [])

  return (
    <div id="evolution-animation" className="relative m-16">
      <motion.div className="relative origin-top-left" style={{scale}}>
        <Image src="/images/process/evolution-background.png" alt="Evolution Background" width="1460" height="1139" />
      </motion.div>
      <motion.div className="absolute inset-0 origin-top-left" style={{x, scale}}>
        <Image src="/images/process/evolution-card.png" alt="Evolution Card" width="1460" height="1139" />
      </motion.div>
      <motion.div className="absolute inset-0 origin-top-left" style={{y, scale}}>
        <Image src="/images/process/evolution-figma.png" alt="Evolution Figma Window" width="1460" height="1139" />
        <div
          className="absolute flex items-center px-1.5 text-[0.7rem] lg:text-[0.5rem] xl:text-[0.7rem] text-black"
          style={{left: '38%', right: '37%', top: '53%', bottom: '40%'}}
        >
          <p>
            <span>{typingLine.substring(0, typingProgress)}</span>
            {typingProgress < 16 && <span>|</span>}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
