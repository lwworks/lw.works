export const getUserData = async (accessToken: string) => {
  console.log(accessToken)
  const response = await fetch(`https://graph.instagram.com/v21.0/me?fields=user_id,username,name&access_token=${accessToken}`, {method: 'GET'})
  const {user_id, username, name} = await response.json()
  if (!username) throw new Error('Error getting user data.')
  return {userId: user_id, username, name}
}
