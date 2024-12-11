import {getAccount} from '@/utils/instagram/get-account'
import {getPost} from '@/utils/instagram/get-post'
import {getPosts} from '@/utils/instagram/get-posts'
import {type NextRequest, NextResponse} from 'next/server'

export async function GET(request: NextRequest) {
  try {
    if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) return new NextResponse('Unauthorized.', {status: 401})

    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get('username')
    const count = searchParams.get('count')
    if (!username || !count) return new NextResponse('Bad request.', {status: 400})

    const {account} = await getAccount({username})
    const {postIds} = await getPosts({userId: account.user_id, token: account.token})

    let posts = []
    let errors = []
    let currentCount = 0
    for (const postId of postIds) {
      if (currentCount === Number(count)) break
      const {post, error} = await getPost({postId, token: account.token})
      if (error) {
        errors.push({postId, error})
      } else if (post.media_product_type !== 'STORY') {
        posts.push(post)
        currentCount++
      }
    }

    if (errors.length > 0) console.log('Errors:', errors)
    return NextResponse.json({posts})
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal server error.', {status: 500})
  }
}
