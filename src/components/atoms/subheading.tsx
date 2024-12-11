import {FC, ReactNode} from 'react'

export const Subheading: FC<{children: ReactNode}> = ({children}) => {
  return (
    <div className="mb-1 flex items-center space-x-4 font-mono uppercase text-indigo-500 dark:text-indigo-400 sm:mb-3">
      <span>{children}</span>
      <span className="text-black/20 dark:text-white/20">{'///'}</span>
    </div>
  )
}
