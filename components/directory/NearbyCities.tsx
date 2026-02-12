/**
 * NearbyCities Component
 *
 * Displays a grid of city links for a given state.
 */

import Link from 'next/link'
import type { City } from '@/lib/types'
import { getCityUrl } from '@/lib/urls'

interface NearbyCitiesProps {
  cities: City[]
  state: { slug: string; name: string }
  limit?: number
}

export function NearbyCities({ cities, state, limit = 12 }: NearbyCitiesProps) {
  const displayed = cities.slice(0, limit)

  if (displayed.length === 0) return null

  return (
    <section className="py-10">
      <h2 className="mb-6 text-xl font-bold text-gray-900">Nearby Cities</h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {displayed.map((city) => (
          <Link
            key={city.id}
            href={getCityUrl(state, city)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
          >
            {city.name}
          </Link>
        ))}
      </div>
    </section>
  )
}
