/**
 * Header Component
 */

import Link from 'next/link'
import { getHomepageUrl, getAllStatesUrl } from '@/lib/urls'

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href={getHomepageUrl()} className="inline-flex min-h-[44px] items-center gap-2">
            <span className="text-xl font-bold text-blue-700">
              Appliance Tech Finder
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href={getHomepageUrl()}
              className="inline-flex min-h-[44px] items-center px-2 text-gray-600 hover:text-blue-700"
            >
              Home
            </Link>
            <Link
              href={getAllStatesUrl()}
              className="inline-flex min-h-[44px] items-center px-2 text-gray-600 hover:text-blue-700"
            >
              Find Repair
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
