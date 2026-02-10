/**
 * URL Generation - Single Source of Truth
 *
 * ALL route strings MUST be generated through this file.
 */

// =============================================================================
// Directory Routes
// =============================================================================

export function getHomepageUrl(): string {
  return '/'
}

export function getAllStatesUrl(): string {
  return '/appliance-repair/'
}

export function getStateUrl(state: { slug: string }): string {
  return `/appliance-repair/${state.slug}/`
}

export function getCityUrl(
  state: { slug: string },
  city: { slug: string }
): string {
  return `/appliance-repair/${state.slug}/${city.slug}/`
}

// =============================================================================
// Static Routes
// =============================================================================

export function getAboutUrl(): string {
  return '/about/'
}

export function getContactUrl(): string {
  return '/contact/'
}

export function getPrivacyUrl(): string {
  return '/privacy/'
}

export function getTermsUrl(): string {
  return '/terms/'
}

// =============================================================================
// Cross-site Links
// =============================================================================

export function getSdfStateUrl(state: { slug: string }): string {
  return `https://scratchanddentfinder.com/scratch-and-dent-appliances/${state.slug}/`
}

export function getSdfCityUrl(
  state: { slug: string },
  city: { slug: string }
): string {
  return `https://scratchanddentfinder.com/scratch-and-dent-appliances/${state.slug}/${city.slug}/`
}
