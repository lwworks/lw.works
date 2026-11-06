/** Route segment for `/kontakte/1`. Leading zeros are not a display id. */
export const parseDisplayId = (value: string) => {
  if (!/^[1-9]\d*$/.test(value)) return null
  const displayId = Number(value)
  return Number.isSafeInteger(displayId) ? displayId : null
}
