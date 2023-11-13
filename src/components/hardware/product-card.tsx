import {FC, ReactNode} from 'react'

export const ProductCard: FC<{glowColor?: string; className?: string; children: ReactNode}> = ({glowColor, className, children}) => {
  return (
    <div className="group w-full">
      <div
        className={`relative flex min-h-full w-full flex-col justify-center overflow-hidden rounded-[2rem] border border-black/10 bg-slate-200/20 backdrop-blur-xl dark:border-white/20 dark:bg-slate-200/5 ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-300 opacity-10 dark:to-slate-400" />
        <div
          className="saturate-125 absolute left-1/4 right-1/4 -bottom-12 aspect-square scale-110 rounded-full opacity-25 blur-2xl brightness-125 dark:brightness-100 dark:saturate-100 lg:scale-100 lg:opacity-40 lg:blur-3xl lg:transition-all lg:duration-500 lg:group-hover:scale-125 lg:group-hover:opacity-60"
          style={{backgroundColor: glowColor}}
        />
        <div className="relative">{children}</div>
      </div>
      <div className="relative mx-8 -mt-px h-px overflow-hidden">
        <div
          className="saturate-125 mx-auto -mt-6 h-12 w-2/3 blur-lg brightness-125 dark:brightness-100 dark:saturate-100"
          style={{backgroundColor: glowColor}}
        />
      </div>
    </div>
  )
}
