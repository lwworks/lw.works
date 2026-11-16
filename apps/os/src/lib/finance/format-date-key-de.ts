/** `2026-11-16` → `16.11.2026`; null stays empty. */
export const formatDateKeyDe = (dateKey: string | null) => (dateKey ? `${dateKey.slice(8, 10)}.${dateKey.slice(5, 7)}.${dateKey.slice(0, 4)}` : '')
