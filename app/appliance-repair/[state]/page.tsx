/**
 * Appliance Repair — State Page
 *
 * Shows cities for browsing repair companies in a given state.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getStateBySlug,
  getCitiesByStateId,
  getRepairCompaniesByStateId,
} from '@/lib/queries'
import {
  getAllStatesUrl,
  getCityUrl,
  getSdfStateUrl,
} from '@/lib/urls'
import { generateStateMetadata } from '@/lib/seo'
import { JsonLd, generateStateBreadcrumbs } from '@/lib/schema'
import { AdUnit } from '@/components/ads/AdUnit'

interface PageProps {
  params: Promise<{ state: string }>
}

export const revalidate = 300

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: stateSlug } = await params
  const state = await getStateBySlug(stateSlug)

  if (!state) return { title: 'State Not Found' }

  return generateStateMetadata(state)
}

export default async function RepairStatePage({ params }: PageProps) {
  const { state: stateSlug } = await params
  const state = await getStateBySlug(stateSlug)

  if (!state) notFound()

  const [cities, repairCompanies] = await Promise.all([
    getCitiesByStateId(state.id),
    getRepairCompaniesByStateId(state.id),
  ])

  return (
    <>
      <JsonLd data={generateStateBreadcrumbs(state)} />

      {/* Hero */}
      <section className="bg-blue-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-4 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href={getAllStatesUrl()} className="hover:text-blue-600">Appliance Repair</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{state.name}</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {state.emoji} Appliance Repair in {state.name}
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            {repairCompanies.length} repair {repairCompanies.length === 1 ? 'company' : 'companies'} found
          </p>
        </div>
      </section>

      {/* Cities Grid */}
      {cities.length > 0 && (
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Browse by City
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {cities.map((city) => (
                <Link
                  key={city.id}
                  href={getCityUrl(state, city)}
                  className="rounded-lg border border-gray-200 bg-white p-3 text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-sm font-medium text-gray-900">{city.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ad */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <AdUnit slot="state-mid" format="horizontal" />
      </div>

      {/* Cross-link to SDF */}
      <section className="bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-gray-700">
            Looking to buy instead?{' '}
            <a
              href={getSdfStateUrl(state)}
              className="font-semibold text-blue-700 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Browse scratch & dent stores in {state.name}
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
