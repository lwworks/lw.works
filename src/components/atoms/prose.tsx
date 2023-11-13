import {FC} from 'react'

export const Prose: FC<{html: string; className?: string | ''}> = ({html, className}) => {
  return (
    <div
      dangerouslySetInnerHTML={{__html: html}}
      className={`prose text-slate-600 prose-a:text-indigo-500 prose-a:no-underline prose-strong:text-black dark:text-slate-300 dark:prose-a:text-indigo-400 dark:prose-strong:text-white ${className}`}
    />
  )
}
