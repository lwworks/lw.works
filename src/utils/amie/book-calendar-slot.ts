export const bookCalendarSlot = async ({
  shareId,
  name,
  email,
  startAt,
  endAt
}: {
  shareId: string
  name: string
  email: string
  startAt: Date
  endAt: Date
}): Promise<{error?: string; success: boolean}> => {
  const response = await fetch(process.env.AMIE_API_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `mutation BookCalendarSlot($input: BookCalendarSlotInput!) {
        bookCalendarSlot(objects: $input) {
          message
          success
          __typename
        }
      }`,
      operationName: 'BookCalendarSlot',
      variables: {
        input: {
          guestName: name,
          guestEmail: email,
          startAt,
          endAt,
          shareLinkId: shareId
        }
      }
    })
  })

  const {data} = await response.json()
  if (!data?.bookCalendarSlot?.success) return {success: false, error: 'Error booking the slot.'}
  return {success: true}
}
