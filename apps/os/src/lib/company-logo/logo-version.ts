/** The `v` query parameter of a company's icon URL: changes with every new logo, `none` while there is none. */
export const logoVersion = (logoKey: string | null) => logoKey?.split('/').pop() || 'none'
