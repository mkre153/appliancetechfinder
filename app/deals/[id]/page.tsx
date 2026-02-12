/**
 * Deal Detail Page
 *
 * Shows full deal information, discount details, and contact CTA.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getCanonicalUrl } from '@/lib/seo'
import { SITE_NAME, SITE_URL } from '@/lib/config'

interface DealPageProps {
  params: Promise<{ id: string }>
}

interface DealDetail {
  id: string
  title: string
  description: string
  companyName: string
  discountType: 'percentage' | 'flat' | 'free_diagnostic'
  discountValue: number | null
  applianceTypes: string[]
  expiresAt: string
  phone: string | null
  email: string
  createdAt: string
}

async function getDealById(id: string): Promise<DealDetail | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabaseAdmin as any)
    .from('repair_deals')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .gte('expires_at', new Date().toISOString())
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    companyName: data.company_name,
    discountType: data.discount_type,
    discountValue: data.discount_value,
    applianceTypes: data.appliance_types || [],
    expiresAt: data.expires_at,
    phone: data.phone,
    email: data.email,
    createdAt: data.created_at,
  }
}

function formatDiscount(type: string, value: number | null): string {
  switch (type) {
    case 'percentage':
      return `${value}% Off`
    case 'flat':
      return `$${value} Off`
    case 'free_diagnostic':
      return 'Free Diagnostic'
    default:
      return 'Special Offer'
  }
}

export async function generateMetadata({ params }: DealPageProps): Promise<Metadata> {
  const { id } = await params
  const deal = await getDealById(id)
  if (!deal) return {}

  const title = `${deal.title} - ${deal.companyName}`
  const description = `${formatDiscount(deal.discountType, deal.discountValue)} on appliance repair from ${deal.companyName}. ${deal.description.slice(0, 120)}`

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/deals/${deal.id}/`),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/deals/${deal.id}/`,
      siteName: SITE_NAME,
      type: 'website',
    },
  }
}

export default async function DealPage({ params }: DealPageProps) {
  const { id } = await params
  const deal = await getDealById(id)

  if (!deal) {
    notFound()
  }

  const daysRemaining = Math.max(
    0,
    Math.ceil((new Date(deal.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  )

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/deals/" className="hover:text-blue-700">
          Deals
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{deal.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Deal Details */}
        <div className="lg:col-span-2">
          {/* Discount badge */}
          <div className="mb-4">
            <span className="inline-block rounded-full bg-red-500 px-4 py-1.5 text-lg font-bold text-white">
              {formatDiscount(deal.discountType, deal.discountValue)}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{deal.title}</h1>

          <p className="mt-2 text-lg text-gray-600">
            by <span className="font-semibold text-gray-800">{deal.companyName}</span>
          </p>

          {/* Expiry */}
          <p className="mt-3 text-sm text-gray-500">
            {daysRemaining > 0
              ? `Expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`
              : 'Expires soon'}
            {' '}({new Date(deal.expiresAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })})
          </p>

          {/* Appliance types */}
          <div className="mt-4 flex flex-wrap gap-2">
            {deal.applianceTypes.map((type) => (
              <span
                key={type}
                className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
              >
                {type}
              </span>
            ))}
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">About This Deal</h2>
            <p className="mt-2 whitespace-pre-line text-gray-700">{deal.description}</p>
          </div>

          {/* Posted date */}
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Posted on{' '}
              {new Date(deal.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Right: Contact CTA */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Claim This Deal</h3>
            <p className="mt-2 text-sm text-gray-600">
              Contact {deal.companyName} directly to take advantage of this offer.
            </p>

            {deal.phone && (
              <a
                href={`tel:${deal.phone}`}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call {deal.phone}
              </a>
            )}

            <div className="mt-6 border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500">
                Mention &quot;Appliance Tech Finder&quot; when you call to claim this deal.
              </p>
            </div>

            <Link
              href="/deals/submit/"
              className="mt-4 block w-full rounded-lg border border-blue-700 py-3 text-center text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              Post Your Own Deal
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
