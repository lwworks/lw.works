import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@lw/ui'],
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
  }
}

export default nextConfig
