/** SevDesk timestamp with offset (`2026-11-16T00:00:00+01:00`) → the calendar day it names (`2026-11-16`). */
export const toDateOnly = (value: string | null | undefined) => (value && /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : null)
