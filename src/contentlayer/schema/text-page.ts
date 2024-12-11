import {defineDocumentType} from 'contentlayer/source-files'
import type * as unified from 'unified'
import {toMarkdown} from 'mdast-util-to-markdown'
import {mdxToMarkdown} from 'mdast-util-mdx'
import {bundleMDX} from 'mdx-bundler'
import {sluggifyTitle} from '../../utils/blog/sluggify-title'
import {Author} from './author'

export const TextPage = defineDocumentType(() => ({
  name: 'TextPage',
  filePathPattern: `pages/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true
    },
    contact: {
      type: 'nested',
      of: Author,
      description: 'Contact person',
      required: true
    }
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (page: any) => page._raw.sourceFileName.replace('.mdx', '')
    },
    language: {
      type: 'string',
      resolve: (page: any) => page._raw.sourceFileDir.split('/')[1]
    },
    headings: {
      type: 'json',
      resolve: async (page: any) => {
        const headings: PostHeading[] = []
        await bundleMDX({
          source: page.body.raw,
          mdxOptions: (opts) => {
            opts.remarkPlugins = [...(opts.remarkPlugins ?? []), tocPlugin(headings)]
            return opts
          }
        })
        return headings
      }
    }
  }
}))

const tocPlugin =
  (toc: PostHeading[]): unified.Plugin =>
  () => {
    return (node: any) => {
      for (const element of node.children.filter((_: any) => _.type === 'heading' || _.name === 'OptionsTable' || _.name === 'Heading')) {
        if (element.type === 'heading') {
          const heading = toMarkdown({type: 'paragraph', children: element.children}, {extensions: [mdxToMarkdown()]})
            .trim()
            .replace(/<.*$/g, '')
            .replace(/\\/g, '')
            .trim()
          toc.push({level: element.depth, heading, slug: sluggifyTitle(heading)})
        }
      }
    }
  }
