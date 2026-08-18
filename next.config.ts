import { withBotId } from 'botid/next/config'
import createMDX from '@next/mdx'
import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {}

const remarkMdxTocPlugin = path.join(process.cwd(), 'src/lib/mdx/remark-mdx-toc.mjs')

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      'remark-frontmatter',
      'remark-breaks',
      [remarkMdxTocPlugin, { name: 'toc' }],
    ],
    rehypePlugins: ['rehype-slug'],
  },
})

export default withBotId(withMDX(nextConfig))
