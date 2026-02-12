/**
 * Suggest a Repair Company Page
 *
 * Public submission page for adding repair companies to the directory.
 */

import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/config'
import { SubmissionForm } from './form'

export const metadata: Metadata = {
  title: `Suggest a Repair Company | ${SITE_NAME}`,
  description:
    'Know a great appliance repair service? Help your community by adding it to our directory.',
}

export default function SubmitCompanyPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Suggest a Repair Company
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Know a great appliance repair service? Help your community by adding
            it to our directory.
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md sm:p-8">
          <SubmissionForm />
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            All submissions are reviewed before being published. We will send a
            verification code to the email you provide.
          </p>
        </div>
      </div>
    </div>
  )
}
