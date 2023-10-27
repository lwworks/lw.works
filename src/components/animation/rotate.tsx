'use client'
import {motion, AnimatePresence} from 'framer-motion'
import {FC, ReactNode, Children, useState, useEffect} from 'react'

export const Rotate: FC<{children: ReactNode; speed?: number; className?: string}> = ({children, speed = 1500, className = ''}) => {
  const array = Children.toArray(children)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  useEffect(() => {
    const id = setInterval(() => setCurrentIndex((id) => (id === array.length - 1 ? 0 : id + 1)), speed)
    return () => {
      clearInterval(id)
    }
  }, [array, speed])

  return (
    <div className={`relative ${className}`}>
      <div className="opacity-0">{array[0]}</div>
      <AnimatePresence initial={false}>
        {Children.map(children, (child, index) => {
          if (index === currentIndex)
            return (
              <motion.div
                key={index}
                initial={{y: '-100%', opacity: 0}}
                animate={{y: 0, opacity: 1}}
                exit={{opacity: 0, transition: {duration: 0.2}}}
                className="absolute whitespace-nowrap top-0 left-0"
              >
                {array[index]}
              </motion.div>
            )
        })}
      </AnimatePresence>
    </div>
  )
}
