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
        source: '/de/contact',
        destination: '/de/kontakt',
        permanent: true
      },
      {
        source: '/en/kontakt',
        destination: '/en/contact',
        permanent: true
      },
      {
        source: '/de/legal',
        destination: '/de/impressum',
        permanent: true
      },
      {
        source: '/en/impressum',
        destination: '/en/legal',
        permanent: true
      },
      {
        source: '/de/privacy',
        destination: '/de/datenschutz',
        permanent: true
      },
      {
        source: '/en/datenschutz',
        destination: '/en/legal',
        permanent: true
      },
      {
        source: '/de/blog/linear-effect',
        destination: '/de/blog/der-linear-effekt',
        permanent: true
      },
      {
        source: '/en/blog/der-linear-effekt',
        destination: '/en/blog/linear-effect',
        permanent: true
      },
      {
        source: '/de/blog/what-is-jamstack',
        destination: '/de/blog/was-ist-der-jamstack',
        permanent: true
      },
      {
        source: '/en/blog/was-ist-der-jamstack',
        destination: '/en/blog/what-is-jamstack',
        permanent: true
      }
    ]
  }
}

module.exports = withContentlayer(nextConfig)
