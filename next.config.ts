import { withBotId } from 'botid/next/config'
import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {}

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-breaks'],
  },
})

export default withBotId(withMDX(nextConfig))
