'use client'

import {sluggifyTitle} from '@/utils/blog/sluggify-title'

export const H2: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
  const slug = sluggifyTitle(children)
  return (
    <h2 id={slug} onClick={() => (window.location.hash = `#${slug}`)} className="group cursor-pointer">
      <span className="absolute left-2 hidden font-mono text-indigo-500 dark:text-indigo-400 md:group-hover:inline lg:left-6">#</span>
      {children}
    </h2>
  )
}

export const H3: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
  const slug = sluggifyTitle(children)
  return (
    <h3 id={slug} onClick={() => (window.location.hash = `#${slug}`)} className="group cursor-pointer">
      <span className="absolute left-2 hidden font-mono text-indigo-500 dark:text-indigo-400 md:group-hover:inline lg:left-6">#</span>
      {children}
    </h3>
  )
}

export const H4: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
  const slug = sluggifyTitle(children)
  return (
    <h4 id={slug} onClick={() => (window.location.hash = `#${slug}`)} className="group cursor-pointer">
      <span className="absolute left-2 hidden font-mono text-indigo-500 dark:text-indigo-400 md:group-hover:inline lg:left-6">#</span>
      {children}
    </h4>
  )
}
