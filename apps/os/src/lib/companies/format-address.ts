export const formatAddress = (address: {
  street: string | null
  postalCode: string | null
  city: string | null
  country: string | null
}) => {
  const locality = [address.postalCode, address.city].filter(Boolean).join(' ')
  return [address.street, locality, address.country].filter((line): line is string => Boolean(line))
}
