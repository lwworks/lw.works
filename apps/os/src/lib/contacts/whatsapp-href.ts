export const whatsAppHref = (value: string) => {
  const digits = value.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : null
}
