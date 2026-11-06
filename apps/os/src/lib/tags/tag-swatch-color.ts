/** Only a stored `#RRGGBB` is used as a CSS color. */
export const tagSwatchColor = (color: string) => (/^#[0-9A-Fa-f]{6}$/.test(color) ? color : '#737373')
