/**
 * Deal Card Component
 *
 * Displays a repair deal/coupon in grid views.
 */

import Link from 'next/link'

export interface DealCardData {
  id: string
  title: string
  companyName: string
  discountType: 'percentage' | 'flat' | 'free_diagnostic'
  discountValue: number | null
  applianceTypes: string[]
  expiresAt: string
  phone: string | null
  description: string
}

function formatDiscount(type: string, value: number | null): string {
  switch (type) {
    case 'percentage':
      return `${value}% OFF`
    case 'flat':
      return `$${value} OFF`
    case 'free_diagnostic':
      return 'FREE Diagnostic'
    default:
      return 'Special Offer'
  }
}

function getDiscountBadgeColor(type: string): string {
  switch (type) {
    case 'percentage':
      return 'bg-red-500 text-white'
    case 'flat':
      return 'bg-orange-500 text-white'
    case 'free_diagnostic':
      return 'bg-green-600 text-white'
    default:
      return 'bg-blue-500 text-white'
  }
}

export function DealCard({ deal }: { deal: DealCardData }) {
  const daysRemaining = Math.max(
    0,
    Math.ceil((new Date(deal.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  )

  return (
    <Link
      href={`/deals/${deal.id}/`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="p-5">
        {/* Discount badge */}
        <div className="mb-3">
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${getDiscountBadgeColor(deal.discountType)}`}
          >
            {formatDiscount(deal.discountType, deal.discountValue)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition">
          {deal.title}
        </h3>

        {/* Company */}
        <p className="mt-1 text-sm font-medium text-gray-600">{deal.companyName}</p>

        {/* Appliance types */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {deal.applianceTypes.slice(0, 4).map((type) => (
            <span
              key={type}
              className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
            >
              {type}
            </span>
          ))}
          {deal.applianceTypes.length > 4 && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              +{deal.applianceTypes.length - 4} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {daysRemaining > 0
              ? `Expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`
              : 'Expires soon'}
          </span>
          {deal.phone && (
            <span
              className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
              onClick={(e) => {
                e.preventDefault()
                window.location.href = `tel:${deal.phone}`
              }}
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
