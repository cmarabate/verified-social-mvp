import { login } from '../actions'
import { Metadata } from 'next'
import Link from 'next/link'
import { getPublicEnv } from '@/env/public'

export const metadata: Metadata = {
  title: 'Log In | VerifiedSocial',
  robots: {
    index: false,
    follow: false,
  },
}

function getErrorMessage(error: unknown) {
  if (typeof error !== 'string') return null
  if (error === 'Could not authenticate user') return error
  if (error === 'Authentication is temporarily unavailable') return error
  return 'Authentication failed'
}

export default function LoginPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const env = getPublicEnv()
  const isSupabaseConfigured = !!(env.supabaseUrl && env.supabaseAnonKey)

  const nextParam = typeof searchParams?.next === 'string' ? searchParams.next : null
  const errorMessage = getErrorMessage(searchParams?.error)

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Log in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {!isSupabaseConfigured && (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700" role="status">
            Authentication is not configured yet. Set the required Supabase public environment variables and reload.
          </div>
        )}

        {errorMessage && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
            {errorMessage}
          </div>
        )}

        <form className="space-y-6" action={login}>
          {nextParam && <input type="hidden" name="next" value={nextParam} />}
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={!isSupabaseConfigured}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={!isSupabaseConfigured}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isSupabaseConfigured}
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Log in
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="font-semibold text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
