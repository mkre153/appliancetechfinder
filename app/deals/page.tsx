/**
 * Deals Browse Page
 *
 * Browse active appliance repair deals with filters.
 */

import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { generatePageMetadata } from '@/lib/seo'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { DealCard, type DealCardData } from '@/components/deals/DealCard'
import { DealFilters } from '@/components/deals/DealFilters'

export function generateMetadata(): Metadata {
  return generatePageMetadata(
    'Appliance Repair Deals & Coupons',
    'Browse appliance repair deals, coupons, and special offers from local repair companies. Save on refrigerator, washer, dryer, and dishwasher repairs.',
    '/deals/'
  )
}

interface DealsPageProps {
  searchParams: Promise<{
    appliance?: string
    discount?: string
    sort?: string
  }>
}

async function getActiveDeals(params: {
  appliance?: string
  discount?: string
  sort?: string
}): Promise<{ deals: DealCardData[]; total: number }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabaseAdmin as any)
    .from('repair_deals')
    .select('*', { count: 'exact' })
    .eq('status', 'approved')
    .gte('expires_at', new Date().toISOString())

  if (params.appliance) {
    query = query.contains('appliance_types', [params.appliance])
  }

  if (params.discount) {
    query = query.eq('discount_type', params.discount)
  }

  if (params.sort === 'expiring') {
    query = query.order('expires_at', { ascending: true })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  query = query.limit(50)

  const { data, count, error } = await query

  if (error) {
    console.error('Error fetching deals:', error)
    return { deals: [], total: 0 }
  }

  const deals: DealCardData[] = (data || []).map((d: Record<string, unknown>) => ({
    id: d.id as string,
    title: d.title as string,
    companyName: d.company_name as string,
    discountType: d.discount_type as 'percentage' | 'flat' | 'free_diagnostic',
    discountValue: d.discount_value as number | null,
    applianceTypes: (d.appliance_types as string[]) || [],
    expiresAt: d.expires_at as string,
    phone: d.phone as string | null,
    description: d.description as string,
  }))

  return { deals, total: count || 0 }
}

async function DealsContent({ searchParams }: DealsPageProps) {
  const params = await searchParams

  const { deals, total } = await getActiveDeals(params)

  return (
    <>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Suspense fallback={null}>
          <DealFilters />
        </Suspense>
        <p className="text-sm text-gray-500">
          {total} deal{total !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Deals Grid */}
      {deals.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No deals yet</h3>
          <p className="mt-2 text-gray-600">
            Be the first repair company to post a deal!
          </p>
          <Link
            href="/deals/submit/"
            className="mt-4 inline-flex rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Post a Deal
          </Link>
        </div>
      )}
    </>
  )
}

export default function DealsPage(props: DealsPageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appliance Repair Deals & Coupons</h1>
          <p className="mt-2 text-gray-600">
            Special offers from local repair companies. Save on your next appliance repair.
          </p>
        </div>
        <Link
          href="/deals/submit/"
          className="inline-flex min-h-[44px] items-center rounded-lg bg-accent px-4 font-semibold text-gray-900 hover:bg-accent-hover"
        >
          Post Your Deal
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg border border-gray-200 p-5">
                <div className="h-6 w-24 bg-gray-200 rounded-full mb-3" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-gray-200 rounded-full" />
                  <div className="h-5 w-16 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        }
      >
        <DealsContent {...props} />
      </Suspense>
    </div>
  )
}
