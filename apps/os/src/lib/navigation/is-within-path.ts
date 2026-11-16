/** Whether `pathname` is `href` or below it (`/finanzen` contains `/finanzen/rechnungen`, not `/finanzenx`). */
export const isWithinPath = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`)
