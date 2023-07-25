import {FC, ReactNode} from 'react'

export const Paragraph: FC<{size?: 'base' | 'lg'; children: ReactNode; className?: string}> = ({size = 'base', children, className}) => {
  return <p className={`leading-relaxed text-slate-600 dark:text-slate-300 ${size === 'base' ? 'text-base' : 'text-lg'} ${className}`}>{children}</p>
}
