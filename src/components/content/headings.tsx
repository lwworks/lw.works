'use client'

import {sluggifyTitle} from '@/utils/blog/sluggify-title'
import {Heading} from '../atoms/heading'

export const H2: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
  const slug = sluggifyTitle(children)
  return (
    <h2 id={slug} onClick={() => (window.location.hash = `#${slug}`)} className="group cursor-pointer">
      <span className="absolute left-2 hidden font-mono text-indigo-500 dark:text-indigo-400 md:group-hover:inline lg:left-6 not-sr-only">#</span>
      {children}
    </h2>
  )
}

export const H3: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
  const slug = sluggifyTitle(children)
  return (
    <h3 id={slug} onClick={() => (window.location.hash = `#${slug}`)} className="group cursor-pointer">
      <span className="absolute left-2 hidden font-mono text-indigo-500 dark:text-indigo-400 md:group-hover:inline lg:left-6 not-sr-only">#</span>
      {children}
    </h3>
  )
}

export const H4: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
  const slug = sluggifyTitle(children)
  return (
    <h4 id={slug} onClick={() => (window.location.hash = `#${slug}`)} className="group cursor-pointer">
      <span className="absolute left-2 hidden font-mono text-indigo-500 dark:text-indigo-400 md:group-hover:inline lg:left-6 not-sr-only">#</span>
      {children}
    </h4>
  )
}

export const ProjectHeading: React.FC<React.PropsWithChildren<{slug: string; hideLink?: boolean | false}>> = ({slug, hideLink, children}) => {
  return (
    <Heading level={2} className="mb-7">
      {hideLink ? (
        <span>{children}</span>
      ) : (
        <span onClick={() => (window.location.hash = `#${slug}`)} className="relative group/heading cursor-pointer">
          <span className="absolute -left-8 hidden font-mono text-indigo-500 dark:text-indigo-400 md:group-hover/heading:inline">#</span>
          {children}
        </span>
      )}
    </Heading>
  )
}
