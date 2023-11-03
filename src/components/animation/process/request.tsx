'use client'

import {motion, useScroll, useTransform} from 'framer-motion'
import Image from 'next/image'
import {useRef} from 'react'

export const RequestAnimation = () => {
  const container = useRef(null) //@ts-ignore
  const {scrollYProgress} = useScroll({target: container, offset: ['center end', 'end start']})
  const x = useTransform(scrollYProgress, [0, 0.4], ['0%', '53%'])
  const y = useTransform(scrollYProgress, [0, 0.06, 0.12, 0.4], [0, 16, 24, 0])
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 1.11])

  return (
    <div ref={container} className="relative my-16 ml-16">
      <motion.div className="origin-top-left" style={{scale}}>
        <Image src="/images/process/request-background.png" alt="Request Background" width="1460" height="1139" />
      </motion.div>
      <motion.div className="absolute inset-0 origin-top-left" style={{x, y, scale}}>
        <Image src="/images/process/request-card.png" alt="Request Card" width="1460" height="1139" />
      </motion.div>
    </div>
  )
}
