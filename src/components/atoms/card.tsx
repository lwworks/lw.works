import {FC, ReactNode} from 'react'

export const Card: FC<{children: ReactNode; className: string; borderAnimation?: boolean | false}> = ({children, className, borderAnimation}) => {
  return (
    <div className="relative overflow-hidden w-full h-full p-px rounded-3xl lg:rounded-[2.5rem] bg-gradient-to-b from-slate-200 to-slate-100 dark:from-[#393C45] dark:to-[#1A1D24]">
      <div className="absolute w-1/2 h-32 -right-8 dark:right-auto dark:-left-8 -top-16 bg-indigo-500 dark:bg-white blur-3xl opacity-25" />
      {borderAnimation && (
        <div className="absolute inset-0 border border-red-500 animate-spin-slow blur-3xl">
          <div className="absolute h-1/2 w-1/2 -right-1/4 bottom-0 bg-indigo-500 dark:bg-indigo-400" style={{borderRadius: '50% 50%'}} />
        </div>
      )}
      <div className={`relative w-full rounded-[23px] lg:rounded-[39px] bg-[#F9FAFB] dark:bg-[#101318] h-full ${className}`}>{children}</div>
    </div>
  )
}
