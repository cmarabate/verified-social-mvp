import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ProfileForm } from './ProfileForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account | VerifiedSocial',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AccountPage() {
  let supabase: Awaited<ReturnType<typeof createClient>>
  try {
    supabase = await createClient()
  } catch {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Your Account</h1>
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700" role="status">
          This app is not configured for authentication yet. Set the required Supabase environment variables to enable account access.
        </div>
      </div>
    )
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Your Account</h1>
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700" role="status">
          Please log in to view your account.
        </div>
        <Link href="/auth/login?next=%2Faccount" className="inline-flex mt-4 text-blue-600 hover:text-blue-500 font-semibold">
          Log in
        </Link>
      </div>
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: verification } = await supabase
    .from('identity_verifications')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Your Account</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <div className="mb-6">
          <div className="text-gray-500 text-sm">Email</div>
          <div className="font-medium">{user.email}</div>
        </div>
        <ProfileForm 
          initialHandle={profile?.handle || ''} 
          initialName={profile?.display_name || ''} 
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Identity Verification</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-gray-500 text-sm">Status</div>
          <div className="font-medium">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
              ${verification?.status === 'verified' ? 'bg-green-100 text-green-800' : 
                verification?.status === 'pending' || verification?.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-gray-100 text-gray-800'}`}>
              {verification?.status || 'unverified'}
            </span>
          </div>

          <div className="text-gray-500 text-sm">Age Requirement</div>
          <div className="font-medium">{profile?.is_adult ? 'Verified (18+)' : 'Not verified'}</div>
        </div>

        {verification?.status !== 'verified' && (
          <div className="mt-6">
            <Link href="/verify" className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Start Verification
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
