import {FC} from 'react'
import {AlertIcon} from './alert'
import {ArrowIcon} from './arrow'
import {CalendarIcon} from './calendar'
import {CartIcon} from './cart'
import {CheckIcon} from './check'
import {CheckSquareIcon} from './check-square'
import {CloseIcon} from './close'
import {GearIcon} from './gear'
import {GlobeIcon} from './globe'
import {InstagramIcon} from './instagram'
import {LinkedinIcon} from './linkedin'
import {LockIcon} from './lock'
import {MenuIcon} from './menu'
import {MoonIcon} from './moon'
import {PlanetIcon} from './planet'
import {StarIcon} from './star'
import {SunIcon} from './sun'
import {TrashIcon} from './trash'
import {TwitterIcon} from './twitter'
import {UserIcon} from './user'
import {UserPlusIcon} from './user-plus'
import {TargetIcon} from './target'
import {TimeFastIcon} from './time-fast'
import {WalletIcon} from './wallet'
import {HeartStashIcon} from './heart-stash'
import {RocketIcon} from './rocket'
import {LightningIcon} from './lightning'

const icons = {
  alert: AlertIcon,
  arrow: ArrowIcon,
  calendar: CalendarIcon,
  cart: CartIcon,
  'check-square': CheckSquareIcon,
  check: CheckIcon,
  close: CloseIcon,
  gear: GearIcon,
  globe: GlobeIcon,
  'heart-stash': HeartStashIcon,
  instagram: InstagramIcon,
  lightning: LightningIcon,
  linkedin: LinkedinIcon,
  lock: LockIcon,
  menu: MenuIcon,
  moon: MoonIcon,
  planet: PlanetIcon,
  rocket: RocketIcon,
  star: StarIcon,
  sun: SunIcon,
  target: TargetIcon,
  'time-fast': TimeFastIcon,
  trash: TrashIcon,
  twitter: TwitterIcon,
  user: UserIcon,
  'user-plus': UserPlusIcon,
  wallet: WalletIcon
}

export type IconName = keyof typeof icons

export const Icon: FC<{name: IconName; className: string}> = ({name, className}) => {
  const IconComponent = icons[name]
  if (!IconComponent) return null
  return <IconComponent className={`${className}`} />
}
