/**
 * JSON-LD Schema helpers for Appliance Tech Finder
 */

import { SITE_URL, SITE_NAME } from '@/lib/config'
import { getAllStatesUrl, getStateUrl, getCityUrl } from '@/lib/urls'
import type { RepairCompany, State, City } from '@/lib/types'

// =============================================================================
// Components
// =============================================================================

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function JsonLdMultiple({ items }: { items: Record<string, unknown>[] }) {
  return (
    <>
      {items.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  )
}

// =============================================================================
// Organization & WebSite
// =============================================================================

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

// =============================================================================
// Breadcrumbs
// =============================================================================

interface BreadcrumbItem {
  name: string
  url: string
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateAllStatesBreadcrumbs() {
  return generateBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Appliance Repair', url: `${SITE_URL}${getAllStatesUrl()}` },
  ])
}

export function generateStateBreadcrumbs(state: State) {
  return generateBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Appliance Repair', url: `${SITE_URL}${getAllStatesUrl()}` },
    { name: state.name, url: `${SITE_URL}${getStateUrl(state)}` },
  ])
}

export function generateCityBreadcrumbs(state: State, city: City) {
  return generateBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Appliance Repair', url: `${SITE_URL}${getAllStatesUrl()}` },
    { name: state.name, url: `${SITE_URL}${getStateUrl(state)}` },
    { name: city.name, url: `${SITE_URL}${getCityUrl(state, city)}` },
  ])
}

// =============================================================================
// LocalBusiness Schema
// =============================================================================

/**
 * Check if a company has enough data for a LocalBusiness schema.
 * Must be approved, have address + lat/lng, and have phone or website.
 */
export function isCompanySchemaEligible(company: RepairCompany): boolean {
  if (!company.isApproved) return false
  if (!company.address || company.lat == null || company.lng == null) return false
  if (!company.phone && !company.website) return false
  return true
}

export function generateLocalBusinessSchema(
  company: RepairCompany,
  state: State,
  city: City
) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: company.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address,
      addressLocality: city.name,
      addressRegion: state.name,
      postalCode: company.zip,
      addressCountry: 'US',
    },
  }

  if (company.lat != null && company.lng != null) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: company.lat,
      longitude: company.lng,
    }
  }

  if (company.phone) {
    schema.telephone = company.phone
  }

  if (company.website) {
    schema.url = company.website
  }

  if (company.description) {
    schema.description = company.description
  }

  if (company.rating != null && company.reviewCount != null && company.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: company.rating,
      reviewCount: company.reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return schema
}

// =============================================================================
// ItemList Schema
// =============================================================================

export function generateItemListSchema(
  companies: RepairCompany[],
  state: State,
  city: City
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Appliance Repair Companies in ${city.name}, ${state.name}`,
    numberOfItems: companies.length,
    itemListElement: companies.map((company, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: company.name,
      url: `${SITE_URL}${getCityUrl(state, city)}`,
    })),
  }
}

// =============================================================================
// FAQ & HowTo Schemas
// =============================================================================

interface FAQ {
  question: string
  answer: string
}

export function generateFAQPageSchema(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

interface HowToStep {
  name: string
  text: string
}

export function generateHowToSchema(
  name: string,
  description: string,
  steps: HowToStep[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}
