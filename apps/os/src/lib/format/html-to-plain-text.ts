const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ' }

/** Google Calendar descriptions are HTML; this keeps line breaks and drops all markup. */
export const htmlToPlainText = (html: string) =>
  html
    .replace(/<br\s*\/?>|<\/(p|div|li|h\d)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(\w+|#39);/g, (match, name: string) => ENTITIES[name] ?? match)
    .replace(/\n{3,}/g, '\n\n')
    .trim()
