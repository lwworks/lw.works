import type { Locale } from '@/i18n/routing'
import type { Metadata } from 'next'

type BlogListingContent = {
  metadata: Metadata
  brow: string
  heading: string
  description: string
}

const content: Record<Locale, BlogListingContent> = {
  de: {
    metadata: {
      title: 'Blog — LW Works GmbH',
      description: 'Artikel und Insights rund um Webentwicklung, Design und digitale Strategien für Unternehmen.'
    },
    brow: 'Blog',
    heading: 'Artikel & Insights',
    description: 'Gedanken zu Webentwicklung, Design und digitalem Wachstum.'
  },
  en: {
    metadata: {
      title: 'Blog — LW Works GmbH',
      description: 'Articles and insights about web development, design, and digital strategies for businesses.'
    },
    brow: 'Blog',
    heading: 'Articles & Insights',
    description: 'Thoughts on web development, design, and digital growth.'
  }
}

export function getBlogListingContent(locale: Locale) {
  return content[locale]
}
