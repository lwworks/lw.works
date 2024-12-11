'use client'

import {FC, ReactNode} from 'react'
import {ThemeProvider as NextThemes} from 'next-themes'

export const ThemeProvider: FC<{children: ReactNode}> = ({children}) => {
  return (
    <NextThemes attribute="class" enableSystem>
      {children}
    </NextThemes>
  )
}
