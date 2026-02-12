/**
 * Deal Submission Page
 *
 * Form for repair companies to post deals and coupons.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { generatePageMetadata } from '@/lib/seo'
import { DealForm } from '@/components/deals/DealForm'

export function generateMetadata(): Metadata {
  return generatePageMetadata(
    'Post a Repair Deal',
    'List your appliance repair deal or coupon for free. Reach homeowners looking for discounted repair services.',
    '/deals/submit/'
  )
}

export default function DealSubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/deals/"
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          &larr; Back to Deals
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Post a Repair Deal</h1>
        <p className="mt-2 text-gray-600">
          List your appliance repair deal, coupon, or special offer for free.
          Reach homeowners looking for repair services.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
        <DealForm />
      </div>
    </div>
  )
}
