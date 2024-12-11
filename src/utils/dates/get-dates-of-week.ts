import {getMonday} from '@/utils/dates/get-monday'

export const getDatesOfWeek = (date: Date): Date[] => {
  const monday = getMonday(date)
  let dates = []
  for (let i = 0; i < 7; i++) {
    dates.push(new Date(new Date(date).setDate(monday.getDate() + i)))
  }
  return dates
}
