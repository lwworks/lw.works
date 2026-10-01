import type { MetadataRoute } from 'next'
import { baseUrl } from '@/lib/site'
import { team } from '@/content/team'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/check`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...Object.values(team).map((member) => ({
      url: `${baseUrl}/kontakt/${member.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    {
      url: `${baseUrl}/impressum`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/datenschutz`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
