/**
 * Admin Claims Review Page
 *
 * Lists pending business ownership claims with approve/reject actions.
 * Phase 12: Marketing — Claim System
 */

import { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { ClaimsTable } from './ClaimsTable'

export const metadata: Metadata = {
  title: 'Claims Review | Admin | Appliance Tech Finder',
  robots: 'noindex, nofollow',
}

async function getClaims() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabaseAdmin as any)
    .from('store_claims')
    .select('*, repair_companies(id, name)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Failed to fetch claims:', error)
    return []
  }
  return data || []
}

export default async function AdminClaimsPage() {
  const { isAuthorized } = await requireAdmin()
  if (!isAuthorized) {
    redirect('/')
  }

  const claims = await getClaims()

  const pendingClaims = claims.filter(
    (c: { status: string }) => c.status === 'pending'
  )
  const reviewedClaims = claims.filter(
    (c: { status: string }) => c.status !== 'pending'
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Claims Review</h1>
        <p className="mt-2 text-gray-600">
          Review and manage business ownership claims.
        </p>

        {/* Pending Claims */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">
            Pending Claims ({pendingClaims.length})
          </h2>
          {pendingClaims.length === 0 ? (
            <p className="mt-4 text-gray-500">No pending claims.</p>
          ) : (
            <ClaimsTable claims={pendingClaims} showActions />
          )}
        </section>

        {/* Reviewed Claims */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900">
            Reviewed Claims ({reviewedClaims.length})
          </h2>
          {reviewedClaims.length === 0 ? (
            <p className="mt-4 text-gray-500">No reviewed claims yet.</p>
          ) : (
            <ClaimsTable claims={reviewedClaims} showActions={false} />
          )}
        </section>
      </div>
    </div>
  )
}
