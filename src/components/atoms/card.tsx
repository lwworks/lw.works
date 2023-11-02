import {FC, ReactNode} from 'react'

export const Card: FC<{children: ReactNode; className: string}> = ({children, className}) => {
  return (
    <div className="relative overflow-hidden w-full p-px rounded-[2.5rem] bg-gradient-to-b from-slate-200 to-slate-100 dark:from-[#393C45] dark:to-[#1A1D24]">
      <div className="absolute w-1/2 h-32 -right-8 dark:right-auto dark:-left-8 -top-16 bg-indigo-500 dark:bg-white blur-3xl opacity-25" />
      <div className={`relative w-full rounded-[39px] bg-[#F9FAFB] dark:bg-[#101318] ${className}`}>{children}</div>
    </div>
  )
}
