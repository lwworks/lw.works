import { detectImageType } from '@/lib/company-icon/detect-image-type'

export const maxLogoUploadBytes = 1024 * 1024

/** Validates an uploaded logo by its bytes (not its declared type). */
export const readLogoUpload = async (
  file: FormDataEntryValue | null,
): Promise<{ ok: true; body: Uint8Array; contentType: string } | { ok: false; message: string }> => {
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: 'Bitte eine Bilddatei wählen.' }
  if (file.size > maxLogoUploadBytes) return { ok: false, message: 'Das Logo darf höchstens 1 MB groß sein.' }
  const body = new Uint8Array(await file.arrayBuffer())
  const contentType = detectImageType(body)
  if (!contentType) return { ok: false, message: 'Erlaubt sind PNG, JPEG, WebP, GIF, SVG und ICO.' }
  return { ok: true, body, contentType }
}
