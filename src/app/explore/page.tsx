import { createClient } from '@/utils/supabase/server'
import { PostComposer } from './PostComposer'
import Link from 'next/link'
import Image from 'next/image'
import { LikeButton } from '@/components/LikeButton'
import { ReportButton } from '@/components/ReportButton'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore | VerifiedSocial',
  description: 'Discover verified posts from the VerifiedSocial community. Browse freely, verify to post.',
  openGraph: {
    title: 'Explore | VerifiedSocial',
    description: 'Discover verified posts from the VerifiedSocial community. Browse freely, verify to post.',
    url: '/explore',
  },
}

export default async function ExplorePage() {
  let supabase: Awaited<ReturnType<typeof createClient>>
  try {
    supabase = await createClient()
  } catch {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Explore</h1>
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700" role="status">
          This app is not configured for data access yet. Please set the required Supabase environment variables to enable the feed.
        </div>
      </div>
    )
  }
  let user: { id: string } | null = null
  try {
    const { data, error } = await supabase.auth.getUser()
    if (!error) {
      user = data.user
    }
  } catch {
    user = null
  }

  let isVerifiedAdult = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_verified, is_adult')
      .eq('id', user.id)
      .single()
    isVerifiedAdult = !!(profile?.is_verified && profile?.is_adult)
  }

  const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select(`
        id,
        content,
        created_at,
        profiles (
          id,
          handle,
          display_name,
          avatar_url,
          is_verified
        ),
        likes (
          user_id
        )
      `)
      .order('created_at', { ascending: false })
      .limit(20)

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Explore</h1>
      
      {user && <PostComposer isVerified={isVerifiedAdult} />}

      <div className="space-y-6">
        {postsError ? (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700" role="status">
            The feed is temporarily unavailable. Please try again later.
          </div>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => {
            const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
            const likeCount = post.likes ? post.likes.length : 0;
            const isLiked = user ? post.likes?.some((l: { user_id: string }) => l.user_id === user.id) : false;

            return (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-gray-500 font-medium relative">
                  {profile?.avatar_url ? (
                    <Image src={profile.avatar_url} alt={`${profile.display_name || 'User'}'s avatar`} fill className="object-cover" sizes="40px" />
                  ) : (
                    <span aria-hidden="true">{(profile?.display_name || 'U').charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-1">
                    {profile?.display_name || 'Unknown User'}
                    {profile?.is_verified && (
                      <span className="text-blue-500 text-xs ml-1 flex items-center bg-blue-50 rounded-full p-0.5" title="Verified account">
                        <span aria-hidden="true">✓</span>
                        <span className="sr-only">Verified account</span>
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    <Link href={`/u/${profile?.handle || profile?.id}`} className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 rounded">
                      @{profile?.handle || profile?.id?.substring(0, 8)}
                    </Link>
                  </div>
                </div>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap mb-4">{post.content}</p>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <LikeButton 
                  postId={post.id} 
                  initialLiked={!!isLiked} 
                  initialCount={likeCount} 
                  disabled={!user || !isVerifiedAdult} 
                />
                <ReportButton 
                  targetId={profile?.id} 
                  postId={post.id} 
                  disabled={!user || !isVerifiedAdult} 
                />
              </div>
            </div>
            )
          })
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200 border-dashed">
            <p className="text-gray-500 font-medium">No posts yet. Be the first to start the conversation!</p>
          </div>
        )}
      </div>
    </div>
  )
}
