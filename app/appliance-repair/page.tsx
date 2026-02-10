/**
 * Appliance Repair Directory — All States
 */

import type { Metadata } from 'next'
import { getAllStates } from '@/lib/queries'
import { StateGrid } from '@/components/directory'
import { SITE_NAME, SITE_URL } from '@/lib/config'
import { getAllStatesUrl } from '@/lib/urls'

export const metadata: Metadata = {
  title: `Appliance Repair by State | ${SITE_NAME}`,
  description:
    'Find appliance repair companies near you. Browse by state to find local repair services for refrigerators, washers, dryers, dishwashers, and more.',
  alternates: {
    canonical: `${SITE_URL}${getAllStatesUrl()}`,
  },
}

export const revalidate = 300

export default async function RepairDirectoryPage() {
  const states = await getAllStates()

  return (
    <>
      <section className="bg-blue-50 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Appliance Repair Companies
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600">
            Find trusted appliance repair services in your area
          </p>
        </div>
      </section>

      <StateGrid states={states} />
    </>
  )
}
