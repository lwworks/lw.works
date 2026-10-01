import { withBotId } from 'botid/next/config'
import createMDX from '@next/mdx'
import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/de', destination: '/', statusCode: 301 },
      { source: '/de/work', destination: '/', statusCode: 301 },
      { source: '/de/hardware', destination: '/', statusCode: 301 },
      { source: '/de/impressum', destination: '/impressum', statusCode: 301 },
      { source: '/de/datenschutz', destination: '/datenschutz', statusCode: 301 },
      { source: '/de/blog', destination: '/', statusCode: 301 },
    ]
  },
}

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
