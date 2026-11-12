import type { ProjectStatus } from '@/lib/db/schema/projects'

const LABELS: Record<ProjectStatus, string> = { planning: 'Planung', active: 'Laufend', completed: 'Abgeschlossen' }

export const projectStatusLabel = (status: ProjectStatus) => LABELS[status]
