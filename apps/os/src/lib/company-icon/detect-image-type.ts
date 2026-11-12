/**
 * The image type from the file's first bytes, or null when it isn't an image we display (ICO, PNG, JPEG, GIF, WebP, SVG).
 * Declared content types aren't trusted: servers send favicons as `text/plain` and uploads can claim anything.
 */
export const detectImageType = (bytes: Uint8Array): string | null => {
  const startsWith = (...signature: number[]) => signature.every((byte, index) => bytes[index] === byte)
  if (startsWith(0x00, 0x00, 0x01, 0x00)) return 'image/x-icon'
  if (startsWith(0x89, 0x50, 0x4e, 0x47)) return 'image/png'
  if (startsWith(0xff, 0xd8, 0xff)) return 'image/jpeg'
  if (startsWith(0x47, 0x49, 0x46, 0x38)) return 'image/gif'
  if (startsWith(0x52, 0x49, 0x46, 0x46) && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return 'image/webp'
  const head = new TextDecoder().decode(bytes.slice(0, 1024)).replace(/^﻿/, '').trimStart().toLowerCase()
  if (head.startsWith('<svg') || ((head.startsWith('<?xml') || head.startsWith('<!--') || head.startsWith('<!doctype svg')) && head.includes('<svg'))) {
    return 'image/svg+xml'
  }
  return null
}
