export const removeContactsFromList = async ({list_id, contact_ids}: {list_id: string; contact_ids: string[]}) => {
  return await fetch(`https://api.sendgrid.com/v3/marketing/lists/${list_id}/contacts?contact_ids=${contact_ids.join(',')}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    }
  })
}
