'use client'

import NextLink from 'next/link'
import { type ComponentProps, useCallback } from 'react'

type LinkProps = ComponentProps<typeof NextLink>

export function Link({ href, onClick, ...props }: LinkProps) {
  const isHash = typeof href === 'string' && href.startsWith('#')

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isHash) {
        e.preventDefault()
        const id = (href as string).slice(1)
        const target = document.getElementById(id)
        if (target) {
          history.replaceState(null, '', window.location.pathname)
          target.scrollIntoView({ behavior: 'smooth' })
          history.replaceState(null, '', href as string)
        }
      }
      onClick?.(e)
    },
    [href, isHash, onClick]
  )

  return <NextLink href={href} onClick={handleClick} {...props} />
}
