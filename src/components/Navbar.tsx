import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { NavLink } from './NavLink'

export default async function Navbar() {
  let user: { id: string } | null = null
  let isAdmin = false

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (!error) {
      user = data.user
    }

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
      isAdmin = profile?.is_admin || false
    }
  } catch {
    user = null
    isAdmin = false
  }

  return (
    <nav className="border-b border-gray-200 bg-white" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 rounded" aria-label="VerifiedSocial Home">
                VerifiedSocial
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink 
                href="/explore" 
                className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 rounded"
                activeClassName="border-blue-500 text-gray-900"
                inactiveClassName="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Explore
              </NavLink>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {isAdmin && (
              <NavLink 
                href="/admin/reports" 
                className="px-3 py-2 rounded-md text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                activeClassName="bg-red-50 text-red-800"
                inactiveClassName="text-red-600 hover:text-red-800"
              >
                Admin Reports
              </NavLink>
            )}
            {user ? (
              <>
                <NavLink 
                  href="/verify" 
                  className="px-3 py-2 rounded-md text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                  activeClassName="bg-gray-100 text-gray-900"
                  inactiveClassName="text-gray-500 hover:text-gray-700"
                >
                  Verify Identity
                </NavLink>
                <NavLink 
                  href="/account" 
                  className="px-3 py-2 rounded-md text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                  activeClassName="bg-gray-100 text-gray-900"
                  inactiveClassName="text-gray-500 hover:text-gray-700"
                >
                  Account
                </NavLink>
                <form action="/auth/logout" method="post">
                  <button type="submit" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <>
                <NavLink 
                  href="/auth/login" 
                  className="px-3 py-2 rounded-md text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                  activeClassName="bg-gray-100 text-gray-900"
                  inactiveClassName="text-gray-500 hover:text-gray-700"
                >
                  Log in
                </NavLink>
                <NavLink 
                  href="/auth/signup" 
                  className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
