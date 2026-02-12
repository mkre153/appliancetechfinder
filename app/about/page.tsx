/**
 * About Page
 *
 * Phase 12: Marketing -- Static Pages
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllStatesUrl, getContactUrl, getSubmitCompanyUrl } from '@/lib/urls'

export const metadata: Metadata = {
  title: 'About Us | Appliance Tech Finder',
  description:
    'Learn about Appliance Tech Finder — our mission to help people find reliable appliance repair services across the United States.',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-blue-50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            About Appliance Tech Finder
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
            Helping homeowners find reliable appliance repair services
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-600">
            When an appliance breaks down, finding a trustworthy repair service
            shouldn&apos;t be a headache. Appliance Tech Finder was built to
            connect homeowners with qualified, local appliance repair companies
            quickly and easily.
          </p>
          <p className="mt-4 text-lg text-gray-600">
            Our directory covers all 50 states, listing repair services for
            refrigerators, washers, dryers, dishwashers, ovens, and more. We
            provide the information you need to make an informed decision:
            contact details, services offered, customer ratings, and locations.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            How the Directory Works
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 text-center shadow">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Search by Location
              </h3>
              <p className="mt-2 text-gray-600">
                Browse repair companies by state and city to find services near
                you.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 text-center shadow">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Compare Options
              </h3>
              <p className="mt-2 text-gray-600">
                View ratings, services, and contact information to pick the best
                fit.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 text-center shadow">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Contact Directly
              </h3>
              <p className="mt-2 text-gray-600">
                Call or visit the repair company directly. No middleman, no
                hidden fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Why Choose Appliance Tech Finder?
          </h2>
          <div className="mt-8 space-y-6">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold">Nationwide Coverage</h3>
                <p className="mt-1 text-gray-600">
                  We list appliance repair companies across all 50 states, from
                  major metros to small towns.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold">Free for Homeowners</h3>
                <p className="mt-1 text-gray-600">
                  Searching our directory is completely free. No registration
                  required to find and contact repair services.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold">Verified Listings</h3>
                <p className="mt-1 text-gray-600">
                  Business owners can claim and verify their listings, ensuring
                  accurate and up-to-date information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Who We Are</h2>
          <p className="mt-4 text-lg text-gray-600">
            Appliance Tech Finder is built and operated by{' '}
            <strong>MK153 Inc.</strong>, a California-based company focused on
            building useful, high-quality local business directories. We combine
            data from multiple sources to create comprehensive listings that
            serve both consumers and businesses.
          </p>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
          <p className="mt-4 text-lg text-gray-600">
            Have questions or feedback? We&apos;d love to hear from you.
          </p>
          <div className="mt-6 space-y-2">
            <p className="text-gray-600">
              <span className="font-semibold">General Inquiries:</span>{' '}
              <a
                href="mailto:support@appliancetechfinder.com"
                className="text-blue-700 hover:underline"
              >
                support@appliancetechfinder.com
              </a>
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={getContactUrl()}
              className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Contact Us
            </Link>
            <Link
              href={getAllStatesUrl()}
              className="rounded-md border border-blue-600 bg-white px-6 py-3 font-semibold text-blue-700 hover:bg-blue-50"
            >
              Browse Directory
            </Link>
          </div>
        </div>
      </section>

      {/* Repair Company Owners CTA */}
      <section className="bg-blue-50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Own a Repair Company?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Join our directory and connect with homeowners looking for appliance
            repair services in your area.
          </p>
          <Link
            href={getSubmitCompanyUrl()}
            className="mt-8 inline-block rounded-md bg-blue-700 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-800"
          >
            Add Your Business
          </Link>
        </div>
      </section>
    </>
  )
}
