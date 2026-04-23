'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitReport(formData: FormData) {
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
    return { error: 'Verification required to report' }
  }

  const targetId = formData.get('target_id') as string
  const postId = formData.get('post_id') as string | null
  const reason = formData.get('reason') as string

  if (!targetId || !reason) return { error: 'Missing required fields' }

  const { error } = await supabase
    .from('reports')
    .insert({
      reporter_id: user.id,
      target_id: targetId,
      post_id: postId || null,
      reason,
      status: 'pending'
    })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function dismissReport(reportId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Must be admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) return { error: 'Admin access required' }

  const { error } = await supabase
    .from('reports')
    .update({ status: 'dismissed' })
    .eq('id', reportId)

  if (error) return { error: error.message }

  // Create audit log
  await supabase.from('admin_audit_logs').insert({
    admin_id: user.id,
    action: 'dismiss_report',
    details: { report_id: reportId }
  })

  revalidatePath('/admin/reports')
  return { success: true }
}

export async function deletePostByAdmin(reportId: string, postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Must be admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) return { error: 'Admin access required' }

  // Delete post
  const { error: deleteError } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (deleteError) return { error: deleteError.message }

  // Update report
  await supabase
    .from('reports')
    .update({ status: 'resolved' })
    .eq('id', reportId)

  // Create audit log
  await supabase.from('admin_audit_logs').insert({
    admin_id: user.id,
    action: 'delete_post',
    target_post_id: postId,
    details: { report_id: reportId }
  })

  revalidatePath('/admin/reports')
  revalidatePath('/explore')
  return { success: true }
}
