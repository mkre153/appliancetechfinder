/**
 * Footer Component
 */

import Link from 'next/link'
import { getHomepageUrl, getAllStatesUrl, getPrivacyUrl, getTermsUrl } from '@/lib/urls'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-white">Appliance Tech Finder</h3>
            <p className="mt-2 text-sm">
              Find appliance repair companies near you. Browse by state and city.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-1">
              <li>
                <Link href={getHomepageUrl()} className="min-h-[44px] inline-flex items-center hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href={getAllStatesUrl()} className="min-h-[44px] inline-flex items-center hover:text-white">
                  Browse All States
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>support@appliancetechfinder.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; 2026 Appliance Tech Finder. Operated by MK153 Inc.</p>
          <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href={getPrivacyUrl()} className="min-h-[44px] inline-flex items-center hover:text-white">
              Privacy Policy
            </Link>
            <span className="hidden sm:inline-flex items-center text-gray-600">|</span>
            <Link href={getTermsUrl()} className="min-h-[44px] inline-flex items-center hover:text-white">
              Terms of Service
            </Link>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Sister site:{' '}
            <a href="https://scratchanddentfinder.com" className="hover:text-white" target="_blank" rel="noopener noreferrer">
              Scratch & Dent Finder
            </a>{' '}
            — find discounted appliances
          </p>
        </div>
      </div>
    </footer>
  )
}
