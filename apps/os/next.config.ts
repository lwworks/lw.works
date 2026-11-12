import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@lw/ui'],
  experimental: {
    // Every OS page is dynamic (per-user). Reuse a visited page for 30s on back-and-forth navigation instead of
    // re-rendering it; server actions (Sync) and sign-out refresh the router, which drops this cache.
    staleTimes: { dynamic: 30 },
    // Business card photos (front + back) are sent to a server action; the client shrinks them first.
    serverActions: { bodySizeLimit: '4mb' },
  },
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
