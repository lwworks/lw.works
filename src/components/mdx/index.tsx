import { Heading } from '@/components/atoms/heading'
import { cn } from '@/lib/utils'
import type { MDXComponents } from 'mdx/types'

export const mdxComponents: MDXComponents = {
  h2: ({ children, ...props }) => (
    <Heading as="h2" className="mt-10 mb-4" {...props}>
      {children}
    </Heading>
  ),
  h3: ({ children, ...props }) => (
    <Heading as="h3" className="mt-8 mb-3" {...props}>
      {children}
    </Heading>
  ),
  p: ({ className, ...props }) => (
    <p className={cn('mt-4 leading-relaxed', className)} {...props} />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn('text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-500', className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn('mt-4 ml-6 list-disc space-y-2', className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn('mt-4 ml-6 list-decimal space-y-2', className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={cn('leading-relaxed', className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn('mt-6 border-l-2 border-indigo-500 pl-6 italic text-neutral-500 dark:text-neutral-400', className)}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn('mt-6 mb-6 overflow-x-auto rounded-lg bg-neutral-900 p-4 text-sm', className)}
      {...props}
    />
  ),
  code: ({ className, ...props }) => {
    const isInline = !className?.includes('language-')
    return isInline ? (
      <code
        className={cn('font-mono text-sm bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded', className)}
        {...props}
      />
    ) : (
      <code className={cn('font-mono text-neutral-100', className)} {...props} />
    )
  },
  hr: ({ className, ...props }) => (
    <hr className={cn('my-8 border-black/10 dark:border-white/10', className)} {...props} />
  ),
  strong: ({ className, ...props }) => (
    <strong className={cn('font-medium text-black dark:text-white', className)} {...props} />
  ),
  img: ({ className, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn('mt-6 rounded-lg', className)} alt={alt} {...props} />
  )
}
