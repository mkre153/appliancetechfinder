'use client'

/**
 * MobileMenu Component
 *
 * Full-screen overlay menu for mobile navigation.
 * 44px touch targets. Closes on link click and Escape key.
 */

import { useEffect } from 'react'
import Link from 'next/link'
import {
  getHomepageUrl,
  getAllStatesUrl,
  getBlogUrl,
  getAboutUrl,
  getContactUrl,
} from '@/lib/urls'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const NAV_LINKS = [
  { label: 'Home', href: getHomepageUrl() },
  { label: 'Find Repair', href: getAllStatesUrl() },
  { label: 'Savings Tips', href: getBlogUrl() },
  { label: 'About', href: getAboutUrl() },
  { label: 'Contact', href: getContactUrl() },
]

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex h-16 items-center justify-between px-4">
        <span className="text-xl font-bold text-blue-700">
          Appliance Tech Finder
        </span>
        <button
          onClick={onClose}
          className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-md text-gray-600 hover:text-gray-900"
          aria-label="Close menu"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <nav className="px-4 pt-4">
        <ul className="space-y-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className="flex min-h-[44px] items-center rounded-lg px-4 text-lg font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
