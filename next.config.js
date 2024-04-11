const {withContentlayer} = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: ''
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/h',
        destination: '/hardware',
        permanent: true
      },
      {
        source: '/q',
        destination: '/hardware',
        permanent: false
      },
      {
        source: '/l',
        destination: '/contact/lukas',
        permanent: true
      }
    ]
  }
}

module.exports = withContentlayer(nextConfig)
