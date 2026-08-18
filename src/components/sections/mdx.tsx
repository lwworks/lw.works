import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type MDXProps = {
  children: ReactNode
  className?: string
}

export const MDX = ({ children, className }: MDXProps) => {
  return (
    <div
      className={cn(
        'prose prose-neutral max-w-none dark:prose-invert',
        'prose-headings:font-heading prose-headings:font-black prose-headings:text-black dark:prose-headings:text-white',
        'prose-h2:mt-10 prose-h2:text-3xl prose-h2:first:mt-0',
        'prose-h3:mt-8 prose-h3:text-xl',
        'prose-p:text-neutral-600 dark:prose-p:text-neutral-400',
        'prose-strong:font-medium prose-strong:text-black dark:prose-strong:text-white',
        'prose-a:text-black prose-a:underline dark:prose-a:text-white prose-a:hover:opacity-80',
        className
      )}
    >
      {children}
    </div>
  )
}
