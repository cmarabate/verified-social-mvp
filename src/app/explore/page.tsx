import { createClient } from '@/utils/supabase/server'
import { PostComposer } from './PostComposer'
import Link from 'next/link'
import { LikeButton } from '@/components/LikeButton'
import { ReportButton } from '@/components/ReportButton'

export default async function ExplorePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isVerifiedAdult = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_verified, is_adult')
      .eq('id', user.id)
      .single()
    isVerifiedAdult = profile?.is_verified && profile?.is_adult
  }

  const { data: posts } = await supabase
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
        {posts && posts.length > 0 ? (
          posts.map((post) => {
            const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
            const likeCount = post.likes ? post.likes.length : 0;
            const isLiked = user ? post.likes?.some((l: { user_id: string }) => l.user_id === user.id) : false;

            return (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {profile?.avatar_url && <img src={profile.avatar_url} alt="Avatar" />}
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-1">
                    {profile?.display_name || 'Unknown User'}
                    {profile?.is_verified && (
                      <span className="text-blue-500 text-xs ml-1" title="Verified">✓</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    <Link href={`/u/${profile?.handle || profile?.id}`} className="hover:underline">
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
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No posts yet. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  )
}
