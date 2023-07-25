import {FC} from 'react'

export const Logo: FC<{className: string}> = ({className}) => {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 55 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.31257 3.02283C6.66833 1.39396 8.30831 0.0734863 9.97559 0.0734863H16.617L11.7216 22.4886H24.4009L22.3396 31.9265H0L6.31257 3.02283Z"
        fill="current"
      />
      <path d="M31.6709 3.02283H41.3312L35.6629 28.977C35.3071 30.606 33.6671 31.9265 31.9998 31.9265H25.3582L31.6709 3.02283Z" fill="current" />
      <path d="M54.6546 0.0734863H44.9942L38.6817 28.977H45.3232C46.9904 28.977 48.6304 27.6566 48.9862 26.0278L54.6546 0.0734863Z" fill="current" />
      <path d="M19.6357 0.0734863H29.2961L25.0447 19.5391H15.3844L19.6357 0.0734863Z" fill="current" />
    </svg>
  )
}
