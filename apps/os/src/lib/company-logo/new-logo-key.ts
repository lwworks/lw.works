/** A fresh object key per logo version, so a new logo gets a new URL (`logoVersion`) and old ones can be cached forever. */
export const newLogoKey = (companyId: string) => `company-logos/${companyId}/${crypto.randomUUID()}`
