export const getUsername = async (accessToken: string) => {
  console.log(accessToken)
  const response = await fetch(`https://graph.instagram.com/v21.0/me?fields=username,name&access_token=${accessToken}`, {method: 'GET'})
  const {username, name} = await response.json()
  if (!username) throw new Error('Error getting username.')
  return {username, name}
}
