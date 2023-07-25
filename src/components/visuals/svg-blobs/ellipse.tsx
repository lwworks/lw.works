import {FC} from 'react'

export const Ellipse: FC<{className: string}> = ({className}) => {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 1097 555" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1094.38 298.022C1065.62 450.573 797.894 564.918 496.389 553.418C194.884 541.919 -26.2237 408.929 2.53189 256.377C31.2875 103.826 299.017 -10.5195 600.522 0.980306C902.027 12.4801 1123.13 145.47 1094.38 298.022Z"
        fill="current"
      />
    </svg>
  )
}
