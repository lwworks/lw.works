import {Heading} from '@/components/atoms/heading'
import {Paragraph} from '@/components/atoms/paragraph'
import {ArrowIcon} from '@/components/icons/arrow'
import {CalendarIcon} from '@/components/icons/calendar'
import {UserIcon} from '@/components/icons/user'
import {BlogPost} from 'contentlayer/generated'
import Link from 'next/link'
import {FC} from 'react'

export const PostPreview: FC<{post: BlogPost}> = ({post}) => {
  return (
    <Link href={`/blog/${post.slug}`} className=" space-y-4">
      <Heading level={3}>{post.title}</Heading>
      <div className="space-y-4">
        <div className="space-y-2 text-slate-600 dark:text-slate-300 sm:flex sm:space-y-0 sm:space-x-8">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 text-indigo-500 dark:text-indigo-400" />
            <p>{post.writtenDate}</p>
          </div>
          <div className="flex items-center space-x-2">
            <UserIcon className="h-5 text-indigo-500 dark:text-indigo-400" />
            <p>{post.author.name}</p>
          </div>
        </div>
        <Paragraph className="line-clamp-3">{post.excerpt}</Paragraph>
        <p className="flex items-center space-x-2 font-semibold text-indigo-500 dark:text-indigo-400">
          <span>Weiterlesen</span>
          <ArrowIcon className="w-4" />
        </p>
      </div>
    </Link>
  )
}
