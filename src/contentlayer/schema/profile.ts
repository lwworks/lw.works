import {defineDocumentType} from 'contentlayer/source-files'

export const Profile = defineDocumentType(() => ({
  name: 'Profile',
  filePathPattern: `profiles/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    firstname: {type: 'string', required: true},
    lastname: {type: 'string', required: true},
    description: {type: 'string', required: true},
    avatar: {type: 'string', required: true},
    email: {type: 'string', required: false},
    phone: {type: 'string', required: false},
    calendar: {type: 'string', required: false},
    whatsapp: {type: 'string', required: false},
    linkedin: {type: 'string', required: false},
    instagram: {type: 'string', required: false},
    twitter: {type: 'string', required: false}
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (post: any) => post._raw.sourceFileName.replace('.mdx', '')
    },
    language: {
      type: 'string',
      resolve: (post: any) => post._raw.sourceFileDir.split('/')[1]
    }
  }
}))
