import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

import { LikeButton } from '@/components/LikeButton'

import { FollowButton } from '@/components/FollowButton'

export default async function ProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isVerifiedAdult = false
  if (user) {
    const { data: currentUserProfile } = await supabase
      .from('profiles')
      .select('is_verified, is_adult')
      .eq('id', user.id)
      .single()
    isVerifiedAdult = currentUserProfile?.is_verified && currentUserProfile?.is_adult
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', handle)
    .single()

  if (!profile) {
    notFound()
  }

  const { count: followersCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', profile.id)

  const { count: followingCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', profile.id)

  let isFollowing = false
  if (user) {
    const { data: follow } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', user.id)
      .eq('following_id', profile.id)
      .single()
    if (follow) isFollowing = true
  }

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      id,
      content,
      created_at,
      likes (
        user_id
      )
    `)
    .eq('author_id', profile.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {profile.avatar_url && <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {profile.display_name || 'Unknown User'}
                {profile.is_verified && (
                  <span className="text-blue-500 text-sm" title="Verified">✓</span>
                )}
              </h1>
              <p className="text-gray-500">@{profile.handle}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span><strong className="text-gray-900">{followingCount || 0}</strong> Following</span>
                <span><strong className="text-gray-900">{followersCount || 0}</strong> Followers</span>
              </div>
            </div>
          </div>
          {user && user.id !== profile.id && (
            <FollowButton 
              targetUserId={profile.id} 
              initialFollowing={isFollowing} 
              disabled={!isVerifiedAdult} 
            />
          )}
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Posts</h2>
      <div className="space-y-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => {
            const likeCount = post.likes ? post.likes.length : 0;
            const isLiked = user ? post.likes?.some((l: { user_id: string }) => l.user_id === user.id) : false;

            return (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-800 whitespace-pre-wrap mb-4">{post.content}</p>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <LikeButton 
                  postId={post.id} 
                  initialLiked={!!isLiked} 
                  initialCount={likeCount} 
                  disabled={!user || !isVerifiedAdult} 
                />
                <div className="text-sm text-gray-400">
                  {new Date(post.created_at).toLocaleString()}
                </div>
              </div>
            </div>
            )
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No posts yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
