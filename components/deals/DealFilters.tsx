'use client'

/**
 * Deal Filters Component
 *
 * Filter sidebar for the deals browse page.
 * Filters by appliance type, discount type, and sort order.
 */

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { APPLIANCE_TYPES } from '@/lib/deal-submission'

const DISCOUNT_TYPES = [
  { value: '', label: 'All Discounts' },
  { value: 'percentage', label: 'Percentage Off' },
  { value: 'flat', label: 'Dollar Off' },
  { value: 'free_diagnostic', label: 'Free Diagnostic' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'expiring', label: 'Expiring Soon' },
]

export function DealFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentType = searchParams.get('appliance') || ''
  const currentDiscount = searchParams.get('discount') || ''
  const currentSort = searchParams.get('sort') || 'newest'

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/deals/?${params.toString()}`)
    },
    [router, searchParams]
  )

  const clearFilters = useCallback(() => {
    router.push('/deals/')
  }, [router])

  return (
    <div className="flex flex-wrap gap-3">
      {/* Appliance type filter */}
      <select
        value={currentType}
        onChange={(e) => updateFilter('appliance', e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Appliances</option>
        {APPLIANCE_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {/* Discount type filter */}
      <select
        value={currentDiscount}
        onChange={(e) => updateFilter('discount', e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {DISCOUNT_TYPES.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={currentSort}
        onChange={(e) => updateFilter('sort', e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {/* Clear filters */}
      {(currentType || currentDiscount) && (
        <button
          onClick={clearFilters}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}
