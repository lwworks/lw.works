/** `h:mm h`, rounded to whole minutes. */
export const formatDuration = (ms: number) => {
  const totalMinutes = Math.max(0, Math.round(ms / 60000))
  return `${Math.floor(totalMinutes / 60)}:${String(totalMinutes % 60).padStart(2, '0')} h`
}
