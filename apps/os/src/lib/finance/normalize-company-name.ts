const LEGAL_FORMS = /\b(gmbh|ug|ag|kg|ohg|gbr|e\s?k|e\s?v|mbh|haftungsbeschrankt|co|ltd|limited|inc|llc|gb|se|partg)\b/g

/** Lowercase name without legal forms, punctuation and extra spaces: `LMB GmbH & Co. KG` → `lmb`. */
export const normalizeCompanyName = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(LEGAL_FORMS, ' ')
    .replace(/\s+/g, ' ')
    .trim()
