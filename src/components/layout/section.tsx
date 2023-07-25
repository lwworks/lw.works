import {FC, ReactNode} from 'react'

export const Section: FC<{children?: ReactNode; className?: string}> = ({children, className}) => {
  return <section className={`relative mx-auto w-full max-w-screen-xl px-6 sm:px-8 lg:px-12 ${className}`}>{children}</section>
}
