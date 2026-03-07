import {defineNestedType} from 'contentlayer/source-files'

export const Author = defineNestedType(() => ({
  name: 'Author',
  fields: {
    name: {type: 'string', required: true},
    description: {type: 'string', required: true},
    avatar: {type: 'string', required: true},
    linkedin: {type: 'string', required: false},
    instagram: {type: 'string', required: false},
    twitter: {type: 'string', required: false},
    email: {type: 'string', required: false}
  }
}))
