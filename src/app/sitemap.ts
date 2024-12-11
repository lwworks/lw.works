import {allBlogPosts, allProfiles, allTextPages} from 'contentlayer/generated'
import {MetadataRoute} from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NODE_ENV === 'production' ? 'https://lw.works' : 'http://localhost:3000'
  return [
    {
      url: `${baseUrl}/de`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    },
    {
      url: `${baseUrl}/de/work`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/en/work`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/de/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5
    },
    {
      url: `${baseUrl}/en/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5
    }, // @ts-ignore
    ...allProfiles.map(({language, slug}) => ({
      url: `${baseUrl}/${language}/contact/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6
    })),
    // @ts-ignore
    ...allBlogPosts.map(({language, slug}) => ({
      url: `${baseUrl}/${language}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5
    })), // @ts-ignore
    ...allTextPages.map(({language, slug}) => ({
      url: `${baseUrl}/${language}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5
    }))
  ]
}
