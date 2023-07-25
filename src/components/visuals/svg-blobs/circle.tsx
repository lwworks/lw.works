import {FC} from 'react'

export const Cirlce: FC<{className: string}> = ({className}) => {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 501 501" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M494.748 198.832C523.035 333.975 436.411 466.461 301.269 494.748C166.126 523.035 33.6405 436.411 5.35341 301.269C-22.9337 166.126 63.6897 33.6405 198.832 5.35341C333.975 -22.9337 466.461 63.6897 494.748 198.832Z"
        fill="current"
      />
    </svg>
  )
}
