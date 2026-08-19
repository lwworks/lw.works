import { Link } from '@/components/link'
import { cn } from '@/lib/utils'
import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithoutRef } from 'react'

const components = {
  a: ({ children, href, className }: ComponentPropsWithoutRef<'a'>) => (
    <Link href={href ?? '#'} className={cn(className)}>
      {children}
    </Link>
  ),
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
