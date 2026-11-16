import { Activity, Building, Clock3, CreditCard, Folder, User } from "@mynaui/icons-react"

export type NavItem = {
  href: string
  label: string
  icon: typeof Activity
  /** Only admins see the item. */
  adminOnly?: boolean
  /** Shown below the item while the current path is inside it. */
  children?: { href: string; label: string }[]
}

/** Main navigation, shared by the desktop sidebar and the mobile menu. */
export const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: Activity },
  { href: "/kontakte", label: "Kontakte", icon: User },
  { href: "/unternehmen", label: "Unternehmen", icon: Building },
  { href: "/zeiterfassung", label: "Zeiterfassung", icon: Clock3 },
  { href: "/projekte", label: "Projekte", icon: Folder },
  { href: "/finanzen", label: "Finanzen", icon: CreditCard, adminOnly: true, children: [{ href: "/finanzen/rechnungen", label: "Rechnungen" }] },
]
