import { Activity, Building, Clock3, CreditCard, Folder, User } from "@mynaui/icons-react"

/** Main navigation, shared by the desktop sidebar and the mobile menu. */
export const navItems = [
  { href: "/", label: "Dashboard", icon: Activity },
  { href: "/kontakte", label: "Kontakte", icon: User },
  { href: "/unternehmen", label: "Unternehmen", icon: Building },
  { href: "/zeiterfassung", label: "Zeiterfassung", icon: Clock3 },
  { href: "/projekte", label: "Projekte", icon: Folder },
  { href: "/", label: "Finanzen", icon: CreditCard },
]
