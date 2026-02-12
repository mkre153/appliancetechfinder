/**
 * SoftCTA Component
 *
 * Soft call to action encouraging users to suggest a repair company.
 */

import Link from 'next/link'
import { getSubmitCompanyUrl } from '@/lib/urls'

export function SoftCTA() {
  return (
    <section className="bg-blue-50 py-12">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Know a Great Repair Company?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Help us build the most complete appliance repair directory. Suggest a
          company and help your neighbors find trusted technicians.
        </p>
        <Link
          href={getSubmitCompanyUrl()}
          className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-800"
        >
          Suggest a Company
        </Link>
      </div>
    </section>
  )
}
