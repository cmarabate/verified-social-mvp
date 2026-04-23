'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const content = formData.get('content') as string
  if (!content || content.trim() === '') return { error: 'Content is required' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Check if verified adult
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_verified, is_adult')
    .eq('id', user.id)
    .single()

  if (!profile?.is_verified || !profile?.is_adult) {
    return { error: 'Verification required to post' }
  }

  const { error } = await supabase
    .from('posts')
    .insert({
      author_id: user.id,
      content: content.trim()
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/explore')
  return { success: true }
}
