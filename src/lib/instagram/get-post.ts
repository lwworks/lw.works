export const getPost = async ({postId, token}: {postId: string; token: string}) => {
  const response = await fetch(
    `https://graph.instagram.com/v21.0/${postId}?fields=caption,media_product_type,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}`,
    {
      method: 'GET'
    }
  )
  const post = await response.json()
  if (!post) throw new Error('Error getting Instagram post.')
  return {post: post.error ? null : post, error: post.error}
}
