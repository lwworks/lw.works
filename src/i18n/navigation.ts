import {createNavigation} from 'next-intl/navigation'
import {routing} from './routing'

const {Link: NextIntlLink, redirect, usePathname, useRouter, getPathname} = createNavigation(routing)

export {NextIntlLink, redirect, usePathname, useRouter, getPathname}
export {Link} from './link'
