/**
 * JSON-LD Schema helpers for Appliance Tech Finder
 */

import { SITE_URL, SITE_NAME } from '@/lib/config'

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'Find appliance repair companies near you. Browse local repair services for refrigerators, washers, dryers, dishwashers, and more.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@appliancetechfinder.com',
      contactType: 'customer service',
    },
  }
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  }
}
