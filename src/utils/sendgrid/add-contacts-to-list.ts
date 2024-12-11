export const addContactsToList = async ({
  list_ids,
  contacts
}: {
  list_ids: string[]
  contacts: {email: string; first_name?: string; last_name?: string}[]
}) => {
  return await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      list_ids,
      contacts
    })
  })
}
