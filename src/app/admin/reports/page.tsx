import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { dismissReport, deletePostByAdmin } from '@/app/actions/admin'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Reports | VerifiedSocial',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminReportsPage() {
  let supabase: Awaited<ReturnType<typeof createClient>>
  try {
    supabase = await createClient()
  } catch {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Reports Queue</h1>
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700" role="status">
          Admin tools are not configured yet. Set the required Supabase environment variables to enable moderation.
        </div>
      </div>
    )
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Reports Queue</h1>
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700" role="status">
          You must be logged in to access admin tools.
        </div>
      </div>
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Reports Queue</h1>
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700" role="status">
          You do not have access to this page.
        </div>
      </div>
    )
  }

  const { data: reports, error: reportsError } = await supabase
    .from('reports')
    .select(`
      *,
      reporter:profiles!reporter_id(id, handle, display_name),
      target:profiles!target_id(id, handle, display_name),
      post:posts(content)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Reports Queue</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {reportsError && (
          <div className="px-6 py-4 text-sm text-gray-700 bg-gray-50" role="status">
            The reports queue is temporarily unavailable. Please try again later.
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports && reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <Link href={`/u/${(report.reporter as any)?.handle}`} className="text-blue-600 hover:underline">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      @{(report.reporter as any)?.handle}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <Link href={`/u/${(report.target as any)?.handle}`} className="text-blue-600 hover:underline">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      @{(report.target as any)?.handle}
                    </Link>
                    {report.post_id && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700 italic border border-gray-200">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        &quot;{(report.post as any)?.content}&quot;
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {report.reason}
                    <div className="text-xs text-gray-400 mt-1">{new Date(report.created_at).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col gap-2">
                      <form action={async () => {
                        'use server';
                        await dismissReport(report.id);
                      }}>
                        <button type="submit" className="text-gray-600 hover:text-gray-900">Dismiss</button>
                      </form>
                      {report.post_id && (
                        <form action={async () => {
                          'use server';
                          await deletePostByAdmin(report.id, report.post_id!);
                        }}>
                          <button type="submit" className="text-red-600 hover:text-red-900">Delete Post</button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  No pending reports.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
