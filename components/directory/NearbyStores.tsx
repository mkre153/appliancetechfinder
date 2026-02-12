'use client'

/**
 * NearbyStores Component
 *
 * Phase 16: Displays nearby repair companies based on lat/lng coordinates.
 * Fetches from /api/stores/nearby and renders a grid of RepairCompanyCards.
 *
 * Only renders if lat/lng are provided.
 */

import { useState, useEffect } from 'react'
import { RepairCompanyCard } from '@/components/directory/RepairCompanyCard'
import type { RepairCompany } from '@/lib/types'

interface NearbyCompany extends RepairCompany {
  distance: number
}

interface NearbyStoresProps {
  lat: number | null
  lng: number | null
  stateSlug?: string
  citySlug?: string
  limit?: number
}

export function NearbyStores({ lat, lng, stateSlug, citySlug, limit = 6 }: NearbyStoresProps) {
  const [companies, setCompanies] = useState<NearbyCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (lat == null || lng == null) return

    const fetchNearby = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `/api/stores/nearby?lat=${lat}&lng=${lng}&limit=${limit}`
        )
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch nearby companies')
        }

        setCompanies(data.companies)
      } catch (err) {
        console.error('Fetch nearby companies error:', err)
        setError('Unable to load nearby repair companies.')
      } finally {
        setLoading(false)
      }
    }

    fetchNearby()
  }, [lat, lng, limit])

  // Don't render if no coordinates
  if (lat == null || lng == null) {
    return null
  }

  // Loading state
  if (loading) {
    return (
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900">
            Nearby Repair Companies
          </h2>
          <div className="mt-4 flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="ml-3 text-gray-600">Finding nearby repair companies...</p>
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900">
            Nearby Repair Companies
          </h2>
          <p className="mt-4 text-gray-600">{error}</p>
        </div>
      </section>
    )
  }

  // No results
  if (companies.length === 0) {
    return null
  }

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Nearby Repair Companies
          </h2>
          <p className="text-sm text-gray-600">
            {companies.length} repair compan{companies.length !== 1 ? 'ies' : 'y'} nearby
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company, index) => (
            <div key={company.id} className="relative">
              <RepairCompanyCard company={company} index={index} />
              <span className="absolute right-3 top-3 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                {company.distance.toFixed(1)} mi
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
