'use client'

import {motion, useScroll, useTransform} from 'framer-motion'
import Image from 'next/image'
import {useEffect, useRef, useState} from 'react'

export const DesignDevAnimation = () => {
  const container = useRef(null) //@ts-ignore
  const {scrollYProgress} = useScroll({target: container, offset: ['center end', 'end start']})
  const scale = useTransform(scrollYProgress, [0, 0.35], [1, 1.11])
  const typing = useTransform(scrollYProgress, [0, 0.15], [0, 36])
  const [progress, setProgress] = useState<number>(0)
  const [typingProgress, setTypingProgress] = useState<number>(0)
  const typingLine = 'npx create-next-app@latest your-site'

  useEffect(() => {
    const clearScrollProgress = scrollYProgress.on('change', (value) => setProgress(value * 100))
    const clearTypingProgress = typing.on('change', (value) => setTypingProgress(Math.ceil(value)))
    return () => {
      clearScrollProgress()
      clearTypingProgress()
    }
  }, [])

  return (
    <div ref={container} className="relative m-16">
      <motion.div className="relative origin-top-left" style={{scale}}>
        <Image src="/images/process/design-dev-background.png" alt="Request Background" width="1460" height="1139" />
        <div className="absolute text-[0.61rem] font-mono text-white px-2 py-1" style={{left: '28%', right: '2%', top: '35%', bottom: '18%'}}>
          <p>
            <span className="text-slate-400">{'> '}</span>
            <span>{typingLine.substring(0, typingProgress)}</span>
            {typingProgress < 36 && <span>|</span>}
          </p>
          {progress > 15 && (
            <p>
              {progress <= 20 && <span className="text-sky-400">? </span>}
              {progress > 20 && <span className="text-green-400">✔ </span>}
              <span>Would you like to use </span>
              <span className="text-indigo-400">Typescript</span>
              <span>? </span>
              <span className="text-slate-400">…</span>
              <span> No / </span>
              <span className="text-sky-400 underline">Yes</span>
            </p>
          )}
          {progress > 20 && (
            <p>
              {progress <= 25 && <span className="text-sky-400">? </span>}
              {progress > 25 && <span className="text-green-400">✔ </span>}
              <span>Would you like to use </span>
              <span className="text-indigo-400">ESLint</span>
              <span>? </span>
              <span className="text-slate-400">…</span>
              <span> No / </span>
              <span className="text-sky-400 underline">Yes</span>
            </p>
          )}
          {progress > 25 && (
            <p>
              {progress <= 30 && <span className="text-sky-400">? </span>}
              {progress > 30 && <span className="text-green-400">✔ </span>}
              <span>Would you like to use </span>
              <span className="text-indigo-400">TailwindCSS</span>
              <span>? </span>
              <span className="text-slate-400">…</span>
              <span> No / </span>
              <span className="text-sky-400 underline">Yes</span>
            </p>
          )}
          {progress > 30 && (
            <p>
              {progress <= 34 && <span className="text-sky-400">? </span>}
              {progress > 34 && <span className="text-green-400">✔ </span>}
              <span>Would you like to use </span>
              <span className="text-indigo-400">`src/` directory</span>
              <span>? </span>
              <span className="text-slate-400">…</span>
              <span> No / </span>
              <span className="text-sky-400 underline">Yes</span>
            </p>
          )}
          {progress > 34 && (
            <p>
              <span className="text-sky-400">? </span>
              <span>Would you like to use </span>
              <span className="text-indigo-400">App Router</span>
              <span>? </span>
              <span className="text-slate-400">…</span>
              <span> No / </span>
              <span className="text-sky-400 underline">Yes</span>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
