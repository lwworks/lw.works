const REPLACEMENTS: Record<string, string> = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }

/** URL slug from a title: lowercase ASCII, German umlauts spelled out, other characters collapsed to `-`. */
export const slugify = (title: string) => {
  const slug = title
    .toLocaleLowerCase('de')
    .replace(/[äöüß]/g, (char) => REPLACEMENTS[char])
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '')
  return slug || 'projekt'
}
