import {Heading} from '@/components/atoms/heading'
import {PostPreview} from '@/components/content/post-preview'
import {Section} from '@/components/layout/section'
import {getDictionary} from '@/utils/get-dictionary'
import {Locale} from '@/i18n.config'
import {allBlogPosts} from 'contentlayer/generated'
import {Metadata} from 'next'

export async function generateMetadata({params: {lang}}: {params: {lang: Locale}}): Promise<Metadata> {
  const dictionary = await getDictionary(lang)
  return dictionary.blog.meta
}

export default async function Page({params}: {params: {lang: Locale}}) {
  const dictionary = await getDictionary(params.lang)

  return (
    <main>
      <Section className="pt-32 pb-24 lg:py-48">
        <Heading level={1}>Blog</Heading>
        <div className="mt-24 grid max-w-xl grid-cols-1 gap-16 md:max-w-none md:grid-cols-2">
          {allBlogPosts
            .filter((post) => post.language === params.lang)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((post, index) => (
              <PostPreview key={index} post={post} content={dictionary.blog.postPreview} />
            ))}
        </div>
      </Section>
    </main>
  )
}
