'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  let supabase: Awaited<ReturnType<typeof createClient>>
  try {
    supabase = await createClient()
  } catch {
    return { error: 'Profile updates are temporarily unavailable' }
  }
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const handle = formData.get('handle') as string
  const display_name = formData.get('display_name') as string

  const { error } = await supabase
    .from('profiles')
    .update({ handle, display_name })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/account')
  return { success: true }
}
