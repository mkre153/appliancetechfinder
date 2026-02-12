/**
 * Admin Submissions List
 *
 * Non-discoverable admin page:
 * - NOT in sitemap
 * - NO public links
 * - force-dynamic (no static rendering)
 * - Role-based auth
 *
 * Displays pending repair company submissions with Approve/Reject actions.
 */

export const dynamic = 'force-dynamic'

import { requireAdmin } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

async function getPendingSubmissions() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabaseAdmin as any)
    .from('repair_company_submissions')
    .select('*')
    .in('status', ['pending', 'verified'])
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch submissions:', error)
    return []
  }
  return data ?? []
}

async function handleApprove(formData: FormData) {
  'use server'
  const submissionId = formData.get('submissionId') as string
  if (!submissionId) return

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin as any)
      .from('repair_company_submissions')
      .update({ status: 'approved' })
      .eq('id', submissionId)

    revalidatePath('/admin/submissions/')
  } catch (error) {
    console.error('Failed to approve submission:', error)
  }
}

async function handleReject(formData: FormData) {
  'use server'
  const submissionId = formData.get('submissionId') as string
  if (!submissionId) return

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin as any)
      .from('repair_company_submissions')
      .update({ status: 'rejected' })
      .eq('id', submissionId)

    revalidatePath('/admin/submissions/')
  } catch (error) {
    console.error('Failed to reject submission:', error)
  }
}

export default async function AdminSubmissions() {
  const { isAuthorized } = await requireAdmin()

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Not Authorized</h1>
          <p className="text-gray-600">You must be an admin to access this page.</p>
        </div>
      </div>
    )
  }

  const submissions = await getPendingSubmissions()

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pending Submissions</h1>
        <Link
          href="/admin/"
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Dashboard
        </Link>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No pending submissions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission: Record<string, string | number | null>) => (
            <div
              key={submission.id as string}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {submission.company_name as string}
                  </h2>
                  <p className="text-gray-600">
                    {submission.address}, {submission.city}, {submission.state} {submission.zip}
                  </p>
                  {submission.phone && (
                    <p className="text-gray-600">Phone: {submission.phone as string}</p>
                  )}
                  {submission.email && (
                    <p className="text-gray-600">Email: {submission.email as string}</p>
                  )}
                  {submission.website && (
                    <p className="text-gray-600">Website: {submission.website as string}</p>
                  )}
                  {submission.services && (
                    <p className="text-gray-600">Services: {submission.services as string}</p>
                  )}
                  <div className="flex gap-3 text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        submission.status === 'verified'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {(submission.status as string) === 'verified'
                        ? 'Email Verified'
                        : 'Pending Verification'}
                    </span>
                    <span className="text-gray-500">
                      Submitted: {new Date(submission.created_at as string).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <form action={handleApprove}>
                    <input type="hidden" name="submissionId" value={submission.id as string} />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      Approve
                    </button>
                  </form>

                  <form action={handleReject}>
                    <input type="hidden" name="submissionId" value={submission.id as string} />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
