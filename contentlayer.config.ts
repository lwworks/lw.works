import {makeSource} from 'contentlayer/source-files'
import {BlogPost} from './src/contentlayer/schema/blog-post'
import {TextPage} from './src/contentlayer/schema/text-page'

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [BlogPost, TextPage]
})
