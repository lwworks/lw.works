export type PageMetadata = {
  title: string
  description: string
}

export type HomeContent = {
  metadata: PageMetadata
  hero: {
    brow?: string
    title: string
    description: string
  }
}

export type ServicesContent = {
  metadata: PageMetadata
  hero: {
    title: string
    description: string
  }
}

export type LandingPageContent = {
  metadata: PageMetadata
  hero: {
    title: string
    description: string
  }
}

export type BlogPostFrontmatter = {
  title: string
  description: string
  date: string
  slug: string
}
