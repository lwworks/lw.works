'use client'

import {type ComponentProps, useCallback} from 'react'
import {NextIntlLink} from './navigation'

type LinkProps = ComponentProps<typeof NextIntlLink>

export function Link({href, onClick, ...props}: LinkProps) {
  const isHash = typeof href === 'string' && href.startsWith('#')

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isHash) {
        e.preventDefault()
        const id = (href as string).slice(1)
        const target = document.getElementById(id)
        if (target) {
          // Clear the hash first so re-clicking the same anchor works
          history.replaceState(null, '', window.location.pathname)
          target.scrollIntoView({behavior: 'smooth'})
          // Re-add the hash after scrolling starts
          history.replaceState(null, '', href as string)
        }
      }
      onClick?.(e as never)
    },
    [href, isHash, onClick]
  )

  return <NextIntlLink href={href} onClick={handleClick} {...props} />
}
