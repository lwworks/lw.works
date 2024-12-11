import {FC, ReactNode} from 'react'
import {motion} from 'framer-motion'
import {Icon} from '../../icons'

export const PopoverNote: FC<{type?: 'success' | 'error'; children: ReactNode}> = ({type, children}) => {
  return (
    <motion.div
      className="absolute left-1/2 -bottom-8 z-10 whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs leading-none text-white shadow-md dark:bg-white dark:text-black"
      initial={{scale: 0, translateX: '-50%'}}
      animate={{scale: 1, translateX: '-50%', originY: 0, transition: {duration: 0.3, type: 'spring'}}}
    >
      <svg
        className="absolute -top-1.5 left-1/2 h-1.5 w-3 -translate-x-1.5 rotate-180 fill-current text-black dark:text-white"
        width="10"
        height="5"
        viewBox="0 0 30 10"
        preserveAspectRatio="none"
      >
        <polygon points="0,0 30,0 15,10"></polygon>
      </svg>
      <div className="flex items-center space-x-2">
        {type && <Icon name={type === 'error' ? 'alert' : 'check'} className={`h-3 ${type === 'error' ? 'text-rose-400' : 'text-emerald-400'}`} />}
        <div>{children}</div>
      </div>
    </motion.div>
  )
}
