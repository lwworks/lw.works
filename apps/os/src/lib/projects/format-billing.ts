import type { Project } from '@/lib/db/schema/projects'

const euro = (cents: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: cents % 100 === 0 ? 0 : 2 }).format(cents / 100)

/** `Stundenbasiert · 95 €/h`, `Festpreis · 12.000 €`, `Retainer · 2.500 €/Monat · 20 h/Monat`. Without amounts, only the kind. */
export const formatBilling = (
  project: Pick<Project, 'billing'> & Partial<Pick<Project, 'hourlyRateCents' | 'fixedPriceCents' | 'retainerAmountCents' | 'retainerHours'>>,
) => {
  if (project.billing === 'hourly') {
    return ['Stundenbasiert', project.hourlyRateCents != null ? `${euro(project.hourlyRateCents)}/h` : null].filter(Boolean).join(' · ')
  }
  if (project.billing === 'fixed') {
    return ['Festpreis', project.fixedPriceCents != null ? euro(project.fixedPriceCents) : null].filter(Boolean).join(' · ')
  }
  return [
    'Retainer',
    project.retainerAmountCents != null ? `${euro(project.retainerAmountCents)}/Monat` : null,
    project.retainerHours != null ? `${project.retainerHours} h/Monat` : null,
  ]
    .filter(Boolean)
    .join(' · ')
}
