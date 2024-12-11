export const getPosts = async ({userId, token}: {userId: string; token: string}) => {
  const response = await fetch(`https://graph.instagram.com/v21.0/${userId}/media?access_token=${token}`, {method: 'GET'})
  const {data} = await response.json()
  if (data.length === 0) throw new Error('Error getting post IDs.')
  return {postIds: data.map((post: {id: string}) => post.id)}
}
