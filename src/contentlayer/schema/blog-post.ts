import {defineDocumentType} from 'contentlayer/source-files'
import {format} from 'date-fns' //@ts-ignore
import {de, enUS} from 'date-fns/locale/index.js'
import type * as unified from 'unified'
import {toMarkdown} from 'mdast-util-to-markdown'
import {mdxToMarkdown} from 'mdast-util-mdx'
import {bundleMDX} from 'mdx-bundler'
import {sluggifyTitle} from '../../utils/blog/sluggify-title'
import {Author} from './author'

export const BlogPost = defineDocumentType(() => ({
  name: 'BlogPost',
  filePathPattern: `blog/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true
    },
    excerpt: {
      type: 'string',
      description: 'Short intro to the post',
      required: true
    },
    author: {
      type: 'nested',
      of: Author,
      description: 'The author of the post',
      required: true
    }
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (post: any) => post._raw.sourceFileName.replace('.mdx', '')
    },
    language: {
      type: 'string',
      resolve: (post: any) => post._raw.sourceFileDir.split('/')[1]
    },
    writtenDate: {
      type: 'string',
      resolve: (post: any) => {
        if (post._raw.sourceFileDir.split('/')[1] === 'en') {
          return format(new Date(post.date), 'MMMM dd, yyyy', {locale: enUS})
        } else {
          return format(new Date(post.date), 'dd. MMMM yyyy', {locale: de})
        }
      }
    },
    headings: {
      type: 'json',
      resolve: async (post: any) => {
        const headings: PostHeading[] = []
        await bundleMDX({
          source: post.body.raw,
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
