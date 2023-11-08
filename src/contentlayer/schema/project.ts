import {defineDocumentType} from 'contentlayer/source-files'
import {format} from 'date-fns' //@ts-ignore
import {de, enUS} from 'date-fns/locale/index.js'

export const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: `projects/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    name: {
      type: 'string',
      description: 'The name of the client',
      required: true
    },
    date: {
      type: 'date',
      description: 'The date of the websites launch',
      required: true
    },
    tag: {
      type: 'enum',
      description: 'Tag/Category of the project',
      options: ['Software/SaaS', 'eCommerce', 'Other'],
      required: true
    }
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (project: any) => project._raw.sourceFileName.replace('.mdx', '')
    },
    language: {
      type: 'string',
      resolve: (project: any) => project._raw.sourceFileDir.split('/')[1]
    },
    writtenDate: {
      type: 'string',
      resolve: (project: any) => format(new Date(project.date), 'MMMM yyyy', {locale: project._raw.sourceFileDir.split('/')[1] === 'en' ? enUS : de})
    }
  }
}))
