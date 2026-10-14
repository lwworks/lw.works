import type { MDXProps } from 'mdx/types'
import type { JSX } from 'react'
import type { MdxTocEntry } from '@/types/mdx-toc'

declare module '*.mdx' {
  export const toc: MdxTocEntry[]
  export default function MDXContent(props: MDXProps): JSX.Element
}
