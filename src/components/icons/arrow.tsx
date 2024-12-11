import {FC} from 'react'

export const ArrowIcon: FC<{className: string}> = ({className}) => {
  return (
    <svg viewBox="0 0 20 10" className={`fill-current ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.5 5C0.5 4.44772 0.947715 4 1.5 4L18.5 4C19.0523 4 19.5 4.44772 19.5 5C19.5 5.55229 19.0523 6 18.5 6L1.5 6C0.947715 6 0.5 5.55228 0.5 5Z"
        fill="current"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.2071 0.292893C14.8166 -0.0976311 14.1834 -0.0976311 13.7929 0.292893C13.4024 0.683418 13.4024 1.31658 13.7929 1.70711L17.0858 5L13.793 8.29274C13.4025 8.68327 13.4025 9.31643 13.793 9.70696C14.1836 10.0975 14.8167 10.0975 15.2073 9.70696L19.2071 5.70711L19.2073 5.70696C19.5978 5.31643 19.5978 4.68327 19.2073 4.29274C19.2023 4.28781 19.1974 4.28294 19.1924 4.27814L15.2071 0.292893Z"
        fill="current"
      />
    </svg>
  )
}
