'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleLike(postId: string, isLiked: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Must be verified
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_verified, is_adult')
    .eq('id', user.id)
    .single()

  if (!profile?.is_verified || !profile?.is_adult) {
    return { error: 'Verification required' }
  }

  if (isLiked) {
    await supabase.from('likes').delete().match({ user_id: user.id, post_id: postId })
  } else {
    await supabase.from('likes').insert({ user_id: user.id, post_id: postId })
  }

  revalidatePath('/explore')
  revalidatePath(`/u/[handle]`)
  return { success: true }
}

export async function toggleFollow(targetUserId: string, isFollowing: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Must be verified
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_verified, is_adult')
    .eq('id', user.id)
    .single()

  if (!profile?.is_verified || !profile?.is_adult) {
    return { error: 'Verification required' }
  }

  if (isFollowing) {
    await supabase.from('follows').delete().match({ follower_id: user.id, following_id: targetUserId })
  } else {
    await supabase.from('follows').insert({ follower_id: user.id, following_id: targetUserId })
  }

  revalidatePath('/explore')
  revalidatePath(`/u/[handle]`)
  return { success: true }
}
