'use client'

import Image from 'next/image'
import {motion} from 'framer-motion'

export const BackgroundBlob = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1, transition: {duration: 1.5}}}
        className="absolute h-screen -inset-x-64 sm:-inset-x-32 lg:inset-x-0"
      >
        <Image
          src="/images/background-blob-light.jpg"
          alt="Background"
          width="2336"
          height="642"
          className="w-full max-w-screen-2xl mx-auto h-auto dark:hidden"
        />
        <Image
          src="/images/background-blob-dark.jpg"
          alt="Background"
          width="2336"
          height="642"
          className="w-full max-w-screen-2xl mx-auto h-auto hidden dark:block"
        />
      </motion.div>
    </div>
  )
}
