import {FC, ReactNode} from 'react'

export const Paragraph: FC<{size?: 'base' | 'lg'; children?: ReactNode; className?: string; html?: string}> = ({
  size = 'base',
  children,
  html,
  className
}) => {
  return (
    <p className={`paragraph leading-relaxed text-neutral-500 dark:text-neutral-300 ${size === 'base' ? 'text-base' : 'text-lg'} ${className}`}>
      {html ? <span dangerouslySetInnerHTML={{__html: html}} /> : children}
    </p>
  )
}
