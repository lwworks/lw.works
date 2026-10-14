import createMDX from '@next/mdx'
import {withBotId} from 'botid/next/config'
import type {NextConfig} from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i0.wp.com'
      },
      {
        protocol: 'https',
        hostname: 'www.hebelifte.de'
      },
      {
        protocol: 'https',
        hostname: 'bni-bremen.de'
      },
      {
        protocol: 'https',
        hostname: 'res2.weblium.site'
      }
    ]
  },
  async redirects() {
    return [
      {source: '/de', destination: '/', statusCode: 301},
      {source: '/de/work', destination: '/', statusCode: 301},
      {source: '/de/hardware', destination: '/', statusCode: 301},
      {source: '/de/impressum', destination: '/impressum', statusCode: 301},
      {source: '/de/datenschutz', destination: '/datenschutz', statusCode: 301},
      {source: '/de/blog', destination: '/', statusCode: 301}
    ]
  }
}

const remarkMdxTocPlugin = path.join(process.cwd(), 'src/lib/mdx/remark-mdx-toc.mjs')

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-breaks', [remarkMdxTocPlugin, {name: 'toc'}]],
    rehypePlugins: ['rehype-slug']
  }
})

export default withBotId(withMDX(nextConfig))
