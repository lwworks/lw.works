export const getWeek = (date: Date): number => {
  const newDate = new Date(date)
  newDate.setHours(0, 0, 0, 0)
  newDate.setDate(newDate.getDate() + 3 - ((newDate.getDay() + 6) % 7))
  var week1 = new Date(newDate.getFullYear(), 0, 4)
  return 1 + Math.round(((newDate.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
}
