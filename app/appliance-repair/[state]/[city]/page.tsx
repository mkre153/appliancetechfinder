/**
 * Appliance Repair — City Page
 *
 * Shows repair companies in a specific city.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getStateBySlug,
  getCityBySlug,
  getRepairCompaniesByCityId,
} from '@/lib/queries'
import {
  getAllStatesUrl,
  getStateUrl,
  getCityUrl,
  getSdfCityUrl,
} from '@/lib/urls'
import { SITE_NAME, SITE_URL } from '@/lib/config'
import { JsonLd } from '@/lib/schema'
import { RepairCompanyCard } from '@/components/directory'
import { AdUnit } from '@/components/ads/AdUnit'

interface PageProps {
  params: Promise<{ state: string; city: string }>
}

export const revalidate = 300

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params
  const state = await getStateBySlug(stateSlug)
  if (!state) return { title: 'Not Found' }

  const city = await getCityBySlug(stateSlug, citySlug)
  if (!city) return { title: 'Not Found' }

  return {
    title: `Appliance Repair in ${city.name}, ${state.name} | ${SITE_NAME}`,
    description: `Find appliance repair companies in ${city.name}, ${state.name}. Local repair services for refrigerators, washers, dryers, dishwashers, and more.`,
    alternates: {
      canonical: `${SITE_URL}${getCityUrl(state, city)}`,
    },
  }
}

export default async function RepairCityPage({ params }: PageProps) {
  const { state: stateSlug, city: citySlug } = await params
  const state = await getStateBySlug(stateSlug)
  if (!state) notFound()

  const city = await getCityBySlug(stateSlug, citySlug)
  if (!city) notFound()

  const companies = await getRepairCompaniesByCityId(city.id)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Appliance Repair', item: `${SITE_URL}${getAllStatesUrl()}` },
      { '@type': 'ListItem', position: 3, name: state.name, item: `${SITE_URL}${getStateUrl(state)}` },
      { '@type': 'ListItem', position: 4, name: city.name, item: `${SITE_URL}${getCityUrl(state, city)}` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      {/* Hero */}
      <section className="bg-blue-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-4 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href={getAllStatesUrl()} className="hover:text-blue-600">Appliance Repair</Link>
            <span className="mx-2">/</span>
            <Link href={getStateUrl(state)} className="hover:text-blue-600">{state.name}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{city.name}</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Appliance Repair in {city.name}, {state.name}
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            {companies.length} repair {companies.length === 1 ? 'company' : 'companies'} found
          </p>
        </div>
      </section>

      {/* Ad: Below hero */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <AdUnit slot="city-top" format="horizontal" />
      </div>

      {/* Company Listings */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {companies.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <h2 className="text-lg font-medium text-gray-900">No repair companies listed yet</h2>
              <p className="mt-2 text-gray-600">
                We&apos;re building our repair directory. Check back soon for
                appliance repair services in {city.name}.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {companies.map((company, index) => (
                <div key={company.id}>
                  <RepairCompanyCard company={company} index={index} />
                  {index === 2 && (
                    <div className="py-4">
                      <AdUnit slot="city-mid" format="rectangle" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ad: After listings */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <AdUnit slot="city-bottom" format="horizontal" />
      </div>

      {/* Cross-link to SDF */}
      <section className="bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-gray-700">
            Looking to buy instead?{' '}
            <a
              href={getSdfCityUrl(state, city)}
              className="font-semibold text-blue-700 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Browse scratch & dent stores in {city.name}
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
