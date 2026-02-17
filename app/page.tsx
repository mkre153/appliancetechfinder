/**
 * Homepage — Appliance Tech Finder
 *
 * Hero + TrustStrip + HowItWorks + StateGrid + ValueProps + FAQ + SoftCTA + Cross-link
 */

import type { Metadata } from 'next'
import { TrustStrip, HowItWorks, ValueProps, FAQ, SoftCTA } from '@/components/marketing'
import { generateHomepageMetadata } from '@/lib/seo'
import USMapSection from '@/components/sections/USMapSection'

export const metadata: Metadata = generateHomepageMetadata()

export const revalidate = 300

export default function HomePage() {
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

      {/* Trust Strip */}
      <TrustStrip />

      {/* How It Works */}
      <HowItWorks />

      {/* US Map */}
      <USMapSection />

      {/* Value Props */}
      <ValueProps />

      {/* FAQ */}
      <FAQ />

      {/* Soft CTA */}
      <SoftCTA />

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
