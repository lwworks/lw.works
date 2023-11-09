'use client'

import {motion, useMotionValue, useScroll, useTransform} from 'framer-motion'
import Image from 'next/image'
import {useEffect} from 'react'

export const RequestAnimation = () => {
  const {scrollY} = useScroll()
  const progress = useMotionValue(0)
  const x = useTransform(progress, [0, 1], ['0%', '53%'])
  const y = useTransform(progress, [0, 0.15, 0.3, 1], [0, 16, 24, 0])
  const scale = useTransform(progress, [0, 1], [1, 1.11])

  useEffect(() => {
    const clientHeight = window.innerHeight
    const topOffset = window.scrollY + document.getElementById('request-animation')!.getBoundingClientRect().top - clientHeight
    const clearScrollProgress = scrollY.on('change', (value) => {
      progress.set((value - topOffset) / clientHeight)
    })
    return () => {
      clearScrollProgress()
    }
  }, [])

  return (
    <div id="request-animation" className="relative m-16">
      <motion.div className="origin-top-left" style={{scale}}>
        <Image src="/images/process/request-background.png" alt="Request Background" width="1460" height="1139" />
      </motion.div>
      <motion.div className="absolute inset-0 origin-top-left" style={{x, y, scale}}>
        <Image src="/images/process/request-card.png" alt="Request Card" width="1460" height="1139" />
      </motion.div>
    </div>
  )
}
