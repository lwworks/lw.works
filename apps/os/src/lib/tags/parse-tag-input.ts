const COLOR = /^#[0-9A-Fa-f]{6}$/

export type TagInput = { name: string; color: string }

/** Tag name is trimmed. Color is stored as `#RRGGBB`. */
export const parseTagInput = (formData: FormData): { ok: true; value: TagInput } | { ok: false; message: string } => {
  const nameValue = formData.get('name')
  const name = typeof nameValue === 'string' ? nameValue.trim() : ''
  if (!name || name.length > 40) return { ok: false, message: 'Name ist erforderlich.' }
  const colorValue = formData.get('color')
  const color = typeof colorValue === 'string' ? colorValue.trim() : ''
  if (!COLOR.test(color)) return { ok: false, message: 'Farbe muss #RRGGBB sein.' }
  return { ok: true, value: { name, color: color.toUpperCase() } }
}
