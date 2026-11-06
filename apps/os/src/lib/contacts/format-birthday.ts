/** `17.03.1996`, or `17.03.` when the year is unknown. */
export const formatBirthday = (birthday: { day: number; month: number; year?: number } | null) => {
  if (!birthday) return null
  const day = String(birthday.day).padStart(2, '0')
  const month = String(birthday.month).padStart(2, '0')
  return birthday.year ? `${day}.${month}.${birthday.year}` : `${day}.${month}.`
}
