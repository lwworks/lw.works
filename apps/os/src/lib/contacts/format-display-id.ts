/** `#` plus at least four digits. `1` → `#0001`, `10000` → `#10000`. */
export const formatDisplayId = (displayId: number) => `#${String(displayId).padStart(4, '0')}`
