import { cn } from "@/lib/utils"

type HeadingProps = {
  as: 'h1' | 'h2' | 'h3' | 'h4'
  size?: 'h1' | 'h2' | 'h3' | 'h4'
  children: React.ReactNode
  className?: string
}

export const Heading = ({ as = 'h2', size, children, className }: HeadingProps) => {
  const Tag = as
  const classes = {
    h1: 'font-heading text-6xl font-black',
    h2: 'font-heading text-3xl font-black',
    h3: 'font-heading text-xl font-black',
    h4: 'font-medium text-black text-base'
  }

  return (
    <Tag className={cn("text-black dark:text-white -ml-1", classes[size ?? as], className)}>
      {children}
    </Tag>
  )
}
