import {Metadata} from 'next'

type Props = {
  name?: string
  title?: string
  description?: string
  path?: string
  image?: string
}

export const getMetadata = ({
  name = 'LW WORKS',
  title = 'Next-Level SaaS Websites – LW WORKS',
  description = 'Lorem ipsum dolor sit amet',
  path = '/',
  image = '/images/social-image.jpg'
}: Props): {metadata: Metadata; jsonLd: any} => {
  return {
    metadata: {
      title,
      description,
      metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
      // alternates: {
      //   canonical: '/',
      //   languages: {
      //     'en-US': '/en-US',
      //     'de-DE': '/de-DE'
      //   }
      // },
      openGraph: {
        type: 'website',
        url: path,
        siteName: name,
        title,
        description,
        images: image
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: image
      }
    },
    jsonLd: {
      '@context': 'http://www.schema.org',
      '@type': 'WebSite',
      name,
      url: path
    }
  }
}
