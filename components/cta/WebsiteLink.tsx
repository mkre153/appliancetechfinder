'use client'

/**
 * WebsiteLink Component
 *
 * Tracked website CTA that logs outbound events.
 * Opens company website in new tab with noopener noreferrer.
 */

import { trackOutboundEvent } from '@/lib/trackers/outbound'

interface WebsiteLinkProps {
  url: string
  companyId: number
  className?: string
}

export function WebsiteLink({ url, companyId, className }: WebsiteLinkProps) {
  const handleClick = () => {
    trackOutboundEvent({
      type: 'website',
      companyId,
      timestamp: Date.now(),
    })
  }

  return (
    <a
      href={url}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? 'inline-flex min-h-[44px] items-center gap-1 hover:text-blue-700 hover:underline'}
      data-testid="website-cta"
    >
      <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
      Visit Website
    </a>
  )
}
