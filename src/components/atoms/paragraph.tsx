import {FC, ReactNode} from 'react'

export const Paragraph: FC<{size?: 'base' | 'lg'; children?: ReactNode; className?: string; html?: string}> = ({
  size = 'base',
  children,
  html,
  className
}) => {
  return (
    <p className={`paragraph leading-relaxed text-slate-600 dark:text-slate-300 ${size === 'base' ? 'text-base' : 'text-lg'} ${className}`}>
      {html ? <span dangerouslySetInnerHTML={{__html: html}} /> : children}
    </p>
  )
}
