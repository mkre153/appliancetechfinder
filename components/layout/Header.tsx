'use client'

/**
 * Header Component
 *
 * Client component with responsive nav and mobile menu.
 */

import { useState } from 'react'
import Link from 'next/link'
import {
  getHomepageUrl,
  getAllStatesUrl,
  getBlogUrl,
  getAboutUrl,
  getContactUrl,
} from '@/lib/urls'
import { MobileMenu } from './MobileMenu'

const NAV_LINKS = [
  { label: 'Home', href: getHomepageUrl() },
  { label: 'Find Repair', href: getAllStatesUrl() },
  { label: 'Savings Tips', href: getBlogUrl() },
  { label: 'About', href: getAboutUrl() },
  { label: 'Contact', href: getContactUrl() },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="bg-white shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href={getHomepageUrl()} className="inline-flex min-h-[44px] items-center gap-2">
              <span className="text-xl font-bold text-blue-700">
                Appliance Tech Finder
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center gap-4 md:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-[44px] items-center px-2 text-gray-600 hover:text-blue-700"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-md text-gray-600 hover:text-gray-900 md:hidden"
              aria-label="Open menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
