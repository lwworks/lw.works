export const getUserData = async (accessToken: string) => {
  console.log(accessToken)
  const response = await fetch(`https://graph.instagram.com/v21.0/me?fields=id,username,name&access_token=${accessToken}`, {method: 'GET'})
  const {id, username, name} = await response.json()
  if (!username) throw new Error('Error getting user data.')
  return {scopedId: id, username, name}
}
