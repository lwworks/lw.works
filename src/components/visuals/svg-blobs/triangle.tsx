import {FC} from 'react'

export const Triangle: FC<{className: string}> = ({className}) => {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 830 944" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M829.541 8.77421L-0.145508 943.073L241.879 0.494751L829.541 8.77421Z" fill="current" />
    </svg>
  )
}
