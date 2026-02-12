import type { Metadata } from 'next'
import Link from 'next/link'
import { getAboutUrl, getSubmitCompanyUrl } from '@/lib/urls'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us | Appliance Tech Finder',
  description:
    'Get in touch with Appliance Tech Finder. Questions about listings, business claims, or partnerships — we are here to help.',
}

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-blue-50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
            We&apos;d love to hear from you
          </p>
        </div>
      </section>

      {/* Contact Form + Sidebar */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Form */}
            <div className="rounded-lg bg-white p-6 shadow md:col-span-2">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Send us a message
              </h2>
              <ContactForm />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Submit Your Company */}
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="text-xl font-bold text-gray-900">
                  Add Your Business
                </h2>
                <p className="mt-2 text-gray-600">
                  Own an appliance repair company? Get listed in our directory.
                </p>
                <Link
                  href={getSubmitCompanyUrl()}
                  className="mt-4 inline-block rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
                >
                  Submit Your Business
                </Link>
              </div>

              {/* Email */}
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="text-lg font-semibold text-gray-900">
                  Email Us Directly
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Prefer email? Reach us at:
                </p>
                <a
                  href="mailto:support@appliancetechfinder.com"
                  className="mt-1 block text-sm text-blue-700 hover:underline"
                >
                  support@appliancetechfinder.com
                </a>
              </div>

              {/* Response Time */}
              <div className="rounded-lg bg-gray-50 p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Response Time
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  We typically respond within 24-48 hours during business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                How do I add my repair company to the directory?
              </h3>
              <p className="mt-2 text-gray-600">
                Visit our{' '}
                <Link
                  href={getSubmitCompanyUrl()}
                  className="text-blue-700 hover:underline"
                >
                  business submission page
                </Link>{' '}
                to add your appliance repair company. Submissions are reviewed
                within 24-48 hours.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                I found incorrect information about a company.
              </h3>
              <p className="mt-2 text-gray-600">
                Use the contact form above and select &quot;Listing
                Correction&quot; as the subject. Include the company name and the
                correction needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Link */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Learn More</h2>
          <p className="mt-4 text-gray-600">
            Want to know more about Appliance Tech Finder?
          </p>
          <Link
            href={getAboutUrl()}
            className="mt-6 inline-block rounded-md border border-blue-600 bg-white px-6 py-3 font-semibold text-blue-700 hover:bg-blue-50"
          >
            About Us
          </Link>
        </div>
      </section>
    </>
  )
}
