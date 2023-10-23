export const getSharedCalendar = async (shareId: string): Promise<{error?: string; sharedCalendar?: SharedCalendar}> => {
  const [fromDate, toDate] = [new Date(), new Date()]
  fromDate.setDate(fromDate.getDate() + 2) // tomorrow
  toDate.setDate(toDate.getDate() + 7 * 3) // three weeks from now

  const response = await fetch(process.env.AMIE_API_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `query RetrieveSharedCalendarLink($id: ID!, $fromDate: DateTime!, $toDate: DateTime!) {
        retrieveSharedCalendarLink(objects: {id: $id, fromDate: $fromDate, toDate: $toDate}) {
          alias
          description
          eventMaxDurationMinutes
          eventMinDurationMinutes
          id
          title
          location
          slots {
            recurrenceRules
            endAt
            startAt
            __typename
          }
          __typename
        }
      }`,
      variables: {
        id: shareId,
        fromDate,
        toDate
      }
    })
  })

  const {data} = await response.json()
  console.log(data)
  if (!data) return {error: 'Error fetching calendar slots.'}
  return {
    sharedCalendar: {
      ...data.retrieveSharedCalendarLink,
      slots: data.retrieveSharedCalendarLink.slots.map((slot: CalendarSlot) => ({...slot, startAt: new Date(slot.startAt), endAt: new Date(slot.endAt)}))
    }
  }
}
