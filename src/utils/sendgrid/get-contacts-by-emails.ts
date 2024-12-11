export const getContactsByEmails = async (emails: string[]) => {
  return await fetch('https://api.sendgrid.com/v3/marketing/contacts/search/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      emails
    }),
    cache: 'no-store'
  })
}
