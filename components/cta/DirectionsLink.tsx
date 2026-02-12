'use client'

/**
 * DirectionsLink Component
 *
 * Tracked directions CTA that logs outbound events.
 * Opens Google Maps with encoded address in new tab.
 */

import { trackOutboundEvent } from '@/lib/trackers/outbound'

interface DirectionsLinkProps {
  address: string
  companyId: number
  className?: string
}

export function DirectionsLink({ address, companyId, className }: DirectionsLinkProps) {
  const handleClick = () => {
    trackOutboundEvent({
      type: 'directions',
      companyId,
      timestamp: Date.now(),
    })
  }

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`

  return (
    <a
      href={mapsUrl}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? 'inline-flex min-h-[44px] items-center gap-1 hover:text-blue-700 hover:underline'}
      data-testid="directions-cta"
    >
      <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      Get Directions
    </a>
  )
}
