import format from 'date-fns/format'

export const getDateSlug = (date: Date): string => {
  return format(date, 'yyyyLLdd')
}
