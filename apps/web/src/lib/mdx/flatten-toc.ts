import type { MdxTocEntry, MdxTocItem } from '@/types/mdx-toc'
import GithubSlugger from 'github-slugger'

const TOC_MIN_DEPTH = 2
const TOC_MAX_DEPTH = 3

export const flattenToc = (entries: MdxTocEntry[]): MdxTocItem[] => {
  const slugger = new GithubSlugger()
  const items: MdxTocItem[] = []

  const walk = (nodes: MdxTocEntry[]) => {
    for (const node of nodes) {
      if (node.depth >= TOC_MIN_DEPTH && node.depth <= TOC_MAX_DEPTH) {
        items.push({
          id: node.attributes.id ?? slugger.slug(node.value),
          title: node.value,
          depth: node.depth,
        })
      }

      if (node.children.length > 0) {
        walk(node.children)
      }
    }
  }

  walk(entries)

  return items
}
