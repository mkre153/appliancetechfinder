/**
 * SEO Metadata Generators
 *
 * Centralized metadata generation for all pages.
 * All pages should use these generators instead of inline metadata.
 */

import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION } from '@/lib/config'
import {
  getHomepageUrl,
  getAllStatesUrl,
  getStateUrl,
  getCityUrl,
  getAboutUrl,
  getContactUrl,
} from '@/lib/urls'
import type { State, City } from '@/lib/types'

// =============================================================================
// URL Helpers
// =============================================================================

/**
 * Get canonical URL with trailing slash
 */
export function getCanonicalUrl(path: string): string {
  const normalized = path.endsWith('/') ? path : `${path}/`
  return `${SITE_URL}${normalized}`
}

// =============================================================================
// OpenGraph / Twitter Helpers
// =============================================================================

function generateOpenGraph(
  title: string,
  description: string,
  url: string
): Metadata['openGraph'] {
  return {
    type: 'website',
    siteName: SITE_NAME,
    title,
    description,
    url,
  }
}

function generateTwitter(
  title: string,
  description: string
): Metadata['twitter'] {
  return {
    card: 'summary',
    title,
    description,
  }
}

// =============================================================================
// Index Decision Helpers
// =============================================================================

/**
 * Whether a state page should be indexed (must have at least 1 company)
 */
export function shouldIndexState(storeCount: number): boolean {
  return storeCount > 0
}

/**
 * Whether a city page should be indexed (must have at least 1 company)
 */
export function shouldIndexCity(storeCount: number): boolean {
  return storeCount > 0
}

// =============================================================================
// Page Metadata Generators
// =============================================================================

export function generateHomepageMetadata(): Metadata {
  const title = `Find Appliance Repair Companies Near You | ${SITE_NAME}`
  const description =
    'Find appliance repair companies near you. Browse by state to find local repair services for refrigerators, washers, dryers, dishwashers, and more.'
  const url = getCanonicalUrl(getHomepageUrl())

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: generateOpenGraph(title, description, url),
    twitter: generateTwitter(title, description),
  }
}

export function generateAllStatesMetadata(): Metadata {
  const title = `Appliance Repair by State | ${SITE_NAME}`
  const description =
    'Find appliance repair companies near you. Browse by state to find local repair services for refrigerators, washers, dryers, dishwashers, and more.'
  const url = getCanonicalUrl(getAllStatesUrl())

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: generateOpenGraph(title, description, url),
    twitter: generateTwitter(title, description),
  }
}

export function generateStateMetadata(state: State): Metadata {
  const title = `Appliance Repair in ${state.name} | ${SITE_NAME}`
  const description =
    state.metaDescription ??
    `Find appliance repair companies in ${state.name}. Browse local repair services for refrigerators, washers, dryers, and more.`
  const url = getCanonicalUrl(getStateUrl(state))

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: generateOpenGraph(title, description, url),
    twitter: generateTwitter(title, description),
    robots: shouldIndexState(state.storeCount)
      ? undefined
      : { index: false, follow: true },
  }
}

export function generateCityMetadata(city: City, state: State): Metadata {
  const title = `Appliance Repair in ${city.name}, ${state.name} | ${SITE_NAME}`
  const description = `Find appliance repair companies in ${city.name}, ${state.name}. Local repair services for refrigerators, washers, dryers, dishwashers, and more.`
  const url = getCanonicalUrl(getCityUrl(state, city))

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: generateOpenGraph(title, description, url),
    twitter: generateTwitter(title, description),
    robots: shouldIndexCity(city.storeCount)
      ? undefined
      : { index: false, follow: true },
  }
}

export function generateAboutMetadata(): Metadata {
  const title = `About | ${SITE_NAME}`
  const description = `Learn about ${SITE_NAME} — a directory helping you find trusted appliance repair companies near you.`
  const url = getCanonicalUrl(getAboutUrl())

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: generateOpenGraph(title, description, url),
    twitter: generateTwitter(title, description),
  }
}

export function generateContactMetadata(): Metadata {
  const title = `Contact Us | ${SITE_NAME}`
  const description = `Get in touch with ${SITE_NAME}. Questions, suggestions, or business listing inquiries.`
  const url = getCanonicalUrl(getContactUrl())

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: generateOpenGraph(title, description, url),
    twitter: generateTwitter(title, description),
  }
}

/**
 * Generic page metadata generator for arbitrary pages (blog, privacy, terms, etc.)
 */
export function generatePageMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`
  const url = getCanonicalUrl(path)

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: generateOpenGraph(fullTitle, description, url),
    twitter: generateTwitter(fullTitle, description),
  }
}
