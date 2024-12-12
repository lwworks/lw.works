import {FC, ReactNode} from 'react'

export const Heading: FC<{level: 1 | 2 | 3 | 4; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; children?: ReactNode; html?: string; className?: string}> = ({
  level,
  size,
  children,
  html,
  className
}) => {
  const style = 'text-black dark:text-white font-display font-extrabold leading-tight'
  const sizes = {
    xs: 'text-base lg:text-lg font-semibold font-sans',
    sm: 'text-lg lg:text-xl dark:drop-shadow-sm',
    md: 'text-xl lg:text-2xl dark:drop-shadow',
    lg: 'text-2xl lg:text-3xl dark:drop-shadow-md',
    xl: 'text-3xl sm:text-4xl lg:text-5xl dark:drop-shadow-lg'
  }

  if (level === 1)
    return <h1 className={`${style} ${sizes[size ?? 'xl']} ${className}`}>{html ? <span dangerouslySetInnerHTML={{__html: html}} /> : children}</h1>
  if (level === 2)
    return <h2 className={`${style} ${sizes[size ?? 'lg']} ${className}`}>{html ? <span dangerouslySetInnerHTML={{__html: html}} /> : children}</h2>
  if (level === 3)
    return <h3 className={`${style} ${sizes[size ?? 'md']} ${className}`}>{html ? <span dangerouslySetInnerHTML={{__html: html}} /> : children}</h3>
  return <h4 className={`${style} ${sizes[size ?? 'sm']} ${className}`}>{html ? <span dangerouslySetInnerHTML={{__html: html}} /> : children}</h4>
}
