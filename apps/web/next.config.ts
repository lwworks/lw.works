import createMDX from '@next/mdx'
import {withBotId} from 'botid/next/config'
import type {NextConfig} from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  transpilePackages: ['@lw/ui'],
  async redirects() {
    return [
      {source: '/de', destination: '/', statusCode: 301},
      {source: '/de/work', destination: '/', statusCode: 301},
      {source: '/de/hardware', destination: '/', statusCode: 301},
      {source: '/de/impressum', destination: '/impressum', statusCode: 301},
      {source: '/de/datenschutz', destination: '/datenschutz', statusCode: 301},
      {source: '/de/blog', destination: '/', statusCode: 301},
      {source: '/os', destination: 'https://os.lw.works', permanent: true},
      {source: '/os/:path*', destination: 'https://os.lw.works/:path*', permanent: true}
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
