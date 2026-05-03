'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { classifySupabaseAvailability } from '@/utils/supabase/userFacing'

function getProfileUpdateErrorMessage(error: unknown) {
  const msg =
    error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string'
      ? (error as { message: string }).message
      : null

  if (msg && (/profiles_handle_key/i.test(msg) || /duplicate key value/i.test(msg))) {
    return 'That handle is already taken.'
  }

  if (classifySupabaseAvailability(error) === 'unreachable') {
    return 'Profile updates are temporarily unavailable.'
  }

  return 'Could not update profile.'
}

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
    return { error: getProfileUpdateErrorMessage(error) }
  }

  revalidatePath('/account')
  return { success: true }
}
