export const getDatesForThreeWeeks = () => {
  const date = new Date()
  let dates = []
  for (let i = 0; i < 21; i++) {
    dates.push(new Date(new Date(date).setDate(date.getDate() + i + 1)))
  }
  return dates
}
