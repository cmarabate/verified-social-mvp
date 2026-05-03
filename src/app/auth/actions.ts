'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

function safeNextPath(value: unknown) {
  if (typeof value !== 'string') return null
  if (!value.startsWith('/')) return null
  if (value.startsWith('//')) return null
  return value
}

export async function login(formData: FormData) {
  const nextPath = safeNextPath(formData.get('next'))
  let supabase: Awaited<ReturnType<typeof createClient>>
  try {
    supabase = await createClient()
  } catch {
    const url = new URL('/auth/login', 'http://localhost')
    url.searchParams.set('error', 'Authentication is temporarily unavailable')
    if (nextPath) url.searchParams.set('next', nextPath)
    redirect(url.pathname + url.search)
  }

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    const url = new URL('/auth/login', 'http://localhost')
    url.searchParams.set('error', 'Could not authenticate user')
    if (nextPath) url.searchParams.set('next', nextPath)
    redirect(url.pathname + url.search)
  }

  revalidatePath('/', 'layout')
  redirect(nextPath || '/account')
}

export async function signup(formData: FormData) {
  const nextPath = safeNextPath(formData.get('next'))
  let supabase: Awaited<ReturnType<typeof createClient>>
  try {
    supabase = await createClient()
  } catch {
    const url = new URL('/auth/signup', 'http://localhost')
    url.searchParams.set('error', 'Signup is temporarily unavailable')
    if (nextPath) url.searchParams.set('next', nextPath)
    redirect(url.pathname + url.search)
  }

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    const url = new URL('/auth/signup', 'http://localhost')
    url.searchParams.set('error', 'Could not create user')
    if (nextPath) url.searchParams.set('next', nextPath)
    redirect(url.pathname + url.search)
  }

  revalidatePath('/', 'layout')
  redirect(nextPath || '/account')
}
