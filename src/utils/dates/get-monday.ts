export const getMonday = (date: Date): Date => {
  const newDate = new Date(date)
  const day = newDate.getDay()
  const diff = newDate.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(newDate.setDate(diff))
  return monday
}
