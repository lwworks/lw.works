import type {MetadataRoute} from 'next'
import {baseUrl} from '@/i18n/routing'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
