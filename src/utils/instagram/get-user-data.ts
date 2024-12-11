export const getUserData = async (accessToken: string) => {
  console.log(accessToken)
  const response = await fetch(`https://graph.instagram.com/v21.0/me?fields=id,user_id,username,name&access_token=${accessToken}`, {method: 'GET'})
  const data = await response.json()
  console.log('user data: ', data)
  const {id, username, name} = data
  if (!username) throw new Error('Error getting user data.')
  return {scopedId: id, username, name}
}
