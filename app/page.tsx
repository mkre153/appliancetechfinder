/**
 * Homepage — Appliance Tech Finder
 *
 * Hero + state grid for browsing repair companies.
 */

import type { Metadata } from 'next'
import { getAllStates } from '@/lib/queries'
import { StateGrid } from '@/components/directory'
import { SITE_NAME, SITE_URL } from '@/lib/config'

export const metadata: Metadata = {
  title: `Find Appliance Repair Companies Near You | ${SITE_NAME}`,
  description:
    'Find appliance repair companies near you. Browse by state to find local repair services for refrigerators, washers, dryers, dishwashers, and more.',
  alternates: {
    canonical: SITE_URL,
  },
}

export const revalidate = 300

export default async function HomePage() {
  const states = await getAllStates()

  return (
    <>
      {/* Hero */}
      <section className="bg-blue-50 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Find Appliance Repair Near You
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600">
            Browse local appliance repair companies by state and city. Get your
            refrigerator, washer, dryer, or dishwasher fixed by trusted local technicians.
          </p>
        </div>
      </section>

      {/* State Grid */}
      <StateGrid states={states} />

      {/* Cross-link to SDF */}
      <section className="bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-gray-700">
            Looking to buy a new appliance at a discount?{' '}
            <a
              href="https://scratchanddentfinder.com"
              className="font-semibold text-blue-700 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Browse scratch & dent stores
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
